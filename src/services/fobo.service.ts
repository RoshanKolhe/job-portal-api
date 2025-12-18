import {inject} from "@loopback/core";
import {Filter, repository} from "@loopback/repository";
import {HttpErrors} from "@loopback/rest";
import FormData from "form-data";
import fs from 'fs';
import path from 'path';

import apiClient from "../interceptors/axios-client.interceptor";
import {STORAGE_DIRECTORY} from "../keys";
import {RunningAnalytics} from "../models";
import {
    ProfileAnalyticsRepository,
    ResumeRepository,
    RunningAnalyticsRepository
} from "../repositories";

export class FOBOService {
    constructor(
        @repository(RunningAnalyticsRepository)
        private runningAnalyticsRepository: RunningAnalyticsRepository,

        @repository(ProfileAnalyticsRepository)
        private profileAnalyticsRepository: ProfileAnalyticsRepository,

        @repository(ResumeRepository)
        private resumeRepository: ResumeRepository,

        @inject(STORAGE_DIRECTORY)
        private storageDirectory: string,
    ) { }

    // --------------------------------------------------
    // get all running analytics
    // --------------------------------------------------
    async fetchRunningAnalyticsList(filter?: Filter<RunningAnalytics>) {
        const analyticsList = await this.runningAnalyticsRepository.find({
            ...filter,
            include: [
                {
                    relation: 'resume',
                    scope: {
                        include: [
                            {
                                relation: 'user',
                                scope: {fields: {email: true, fullName: true}}
                            }
                        ]
                    }
                }
            ]
        });

        return {
            success: true,
            message: 'Running Analytics List',
            analyticsList
        };
    }

    // --------------------------------------------------
    // get or create running analytics
    // --------------------------------------------------
    async getRunningAnalytics(isFoboPro: boolean, resumeId?: number, linkedInUrl?: string) {
        const runningAnalytics = await this.runningAnalyticsRepository.findOne({
            where: {
                and: [
                    {
                        or: [
                            ...(resumeId ? [{resumeId}] : []),
                            ...(linkedInUrl ? [{linkedInUrl}] : []),
                        ]
                    },
                    {isFoboPro}
                ]
            },
            order: ['createdAt DESC']
        });

        if (!runningAnalytics) {
            return this.runningAnalyticsRepository.create({
                resumeId,
                linkedInUrl, // ✅ stored separately
                isFoboPro,
                status: 0,
                trialCount: 0,
                isDeleted: false
            });
        }

        return runningAnalytics;
    }

    // --------------------------------------------------
    // get running analytics by id
    // --------------------------------------------------
    async getRunningAnalyticsById(analyticsId: number) {
        const runningAnalytics = await this.runningAnalyticsRepository.findById(analyticsId);

        if (!runningAnalytics) {
            throw new HttpErrors.NotFound('No Analytics found');
        }

        return runningAnalytics;
    }

    // --------------------------------------------------
    // update running analytics
    // --------------------------------------------------
    async updateRunningAnalytics(analyticsId: number, updatedData: object) {
        await this.runningAnalyticsRepository.updateById(analyticsId, updatedData);
        return this.runningAnalyticsRepository.findById(analyticsId);
    }

    // --------------------------------------------------
    // validate file name
    // --------------------------------------------------
    private validateFileName(fileName: string) {
        const resolved = path.resolve(this.storageDirectory, fileName);
        if (resolved.startsWith(this.storageDirectory)) return resolved;
        throw new HttpErrors.BadRequest(`Invalid file name: ${fileName}`);
    }

    // --------------------------------------------------
    // resolve resume (ONLY by resumeId)
    // --------------------------------------------------
    private async resolveResume(resumeId?: number) {
        let resume = null;

        if (resumeId) {
            resume = await this.resumeRepository.findById(resumeId);
            if (!resume) throw new HttpErrors.NotFound('Resume not found');
        }

        return resume;
    }

    // --------------------------------------------------
    // get fobo analytics
    // --------------------------------------------------
    async getFoboAnalytics(requestBody: any, resume: any, analyticsId: number) {
        try {
            const formData = new FormData();

            if (resume?.fileDetails?.newFileName) {
                const filePath = this.validateFileName(resume.fileDetails.newFileName);
                formData.append('file', fs.createReadStream(filePath));
            }

            formData.append('user_id', resume?.userId ? String(resume.userId) : '1');

            if (requestBody.linkedInUrl) {
                formData.append('linkedin_url', requestBody.linkedInUrl);
            }

            formData.append('X-apiKey', '2472118222258182');
            formData.append('use_resume', String(requestBody.smartInsights));

            if (requestBody.isComprehensiveMode) {
                formData.append('comprehensive_mode', String(true));
            } else {
                formData.append('short_task_description', String(requestBody.viewDetails));
            }

            if (requestBody.isFoboPro) {
                formData.append('pro_mode', 'true');
            }

            const response: any = await apiClient.post(
                `${process.env.SERVER_URL}/fobo`,
                formData,
                {
                    headers: formData.getHeaders(),
                    validateStatus: () => true,
                }
            );

            console.log('FOBO RESPONSE:', response.data);

            if (response.status !== 200 || response.data?.status !== 'success') {
                throw new Error(response.data?.message || 'FOBO failed');
            }
            const analyticsData = await this.profileAnalyticsRepository.create({
                ...(resume?.id && {resumeId: resume.id}),
                ...(requestBody.linkedInUrl && {linkedInUrl: requestBody.linkedInUrl}),
                ...response.data.data,
                isFoboPro: requestBody.isFoboPro ?? false
            });

            await this.updateRunningAnalytics(analyticsId, {status: 2});

            return {success: true, analyticsData};
        } catch (error: any) {
            // console.error('FOBO Service Error:', error?.response?.data?.message);

            const foboMessage =
                error?.response?.data?.message ||     // ✅ REAL FOBO MESSAGE
                error?.response?.data?.error_code ||  // fallback
                error?.message ||                     // axios generic
                'FOBO failed';

            await this.updateRunningAnalytics(analyticsId, {
                status: 3,
                error: foboMessage,
            });

            return {
                success: false,
                error: foboMessage,
            };
        }
    }

    // --------------------------------------------------
    // MAIN ENTRY
    // --------------------------------------------------
    async getFoboData(requestBody: any, resumeId?: number) {
        const linkedInUrl = requestBody.linkedInUrl;

        const resume = await this.resolveResume(resumeId);

        const runningAnalytics = await this.getRunningAnalytics(
            requestBody.isFoboPro === true,
            resume?.id,
            linkedInUrl
        );

        if (runningAnalytics.status === 1) {
            return {
                success: true,
                message: "Processing... Check again in 2-5 minutes",
                status: 1,
            };
        }

        if (runningAnalytics.status === 0 && runningAnalytics.id) {
            await this.updateRunningAnalytics(runningAnalytics.id, {status: 1});

            if (requestBody.isFoboPro) {
                setImmediate(async () => {
                    await this.runFoboProcessing(resume, requestBody, runningAnalytics);
                });

                return {
                    success: true,
                    message: "FOBO Pro started... You can check later",
                    status: 1,
                };
            }

            const foboResponse = await this.runFoboProcessing(
                resume,
                requestBody,
                runningAnalytics
            );

            if (foboResponse.success) {
                const profileData = await this.profileAnalyticsRepository.findOne({
                    where: {
                        ...(resume?.id && {resumeId: resume.id}),
                        ...(linkedInUrl && {linkedInUrl}),
                    },
                    order: ['createdAt DESC'],
                });

                return {
                    success: true,
                    message: "FOBO Score Generated",
                    analytics: profileData,
                };
            }

            return {
                success: false,
                message: "FOBO Processing failed",
                status: 3,
            };
        }

        return {
            success: false,
            message: "No analytics found or invalid processing state.",
        };
    }

    // --------------------------------------------------
    // retry processor
    // --------------------------------------------------
    private async runFoboProcessing(resume: any, requestBody: any, runningAnalytics: any) {
        let count = runningAnalytics.trialCount || 0;

        for (; count < 3; count++) {
            const foboData = await this.getFoboAnalytics(requestBody, resume, runningAnalytics.id);

            if (foboData?.success) {
                await this.updateRunningAnalytics(runningAnalytics.id, {
                    trialCount: count,
                    status: 2,
                    isDeleted: true,
                });
                return {success: true};
            }

            await this.updateRunningAnalytics(runningAnalytics.id, {
                trialCount: count,
                status: 3,
            });
        }

        await this.updateRunningAnalytics(runningAnalytics.id, {
            status: 3,
        });

        return {success: false};
    }

    // --------------------------------------------------
    // retry API
    // --------------------------------------------------
    async getRetryFoboData(resumeId: number, requestBody: any) {
        const linkedInUrl = requestBody.linkedInUrl;

        const resume = await this.resolveResume(resumeId);

        const runningAnalytics = await this.getRunningAnalytics(
            requestBody.isFoboPro === true,
            resume?.id,
            linkedInUrl
        );

        if (runningAnalytics.status === 1) {
            return {
                success: true,
                message: "Processing... Check again in 2-5 minutes",
                status: 1,
            };
        }

        if (runningAnalytics.id !== undefined) {
            const analyticsId = runningAnalytics.id;

            await this.updateRunningAnalytics(analyticsId, {
                status: 1,
                trialCount: runningAnalytics.trialCount + 1
            });

            setImmediate(async () => {
                await this.getFoboAnalytics(requestBody, resume, analyticsId);
            });

            return {
                success: true,
                message: "FOBO Pro started... You can check later",
                status: 1,
            };
        }

        return {
            success: false,
            message: "No analytics found or invalid processing state.",
        };
    }
}
