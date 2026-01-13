import { inject } from "@loopback/core";
import { Filter, repository } from "@loopback/repository";
import { HttpErrors } from "@loopback/rest";
import FormData from "form-data";
import fs from 'fs';
import path from 'path';

import apiClient from "../interceptors/axios-client.interceptor";
import { STORAGE_DIRECTORY } from "../keys";
import { RunningAnalytics, User } from "../models";
import {
    ProfileAnalyticsRepository,
    ResumeRepository,
    RunningAnalyticsRepository,
    UserRepository
} from "../repositories";
import generateFoboProFailTemplate from '../templates/fobo-pro-fail.template';
import generateFoboProSuccessTemplate from '../templates/fobo-pro-successful.template';
import { EmailService } from './email.service';

export class FOBOService {
    constructor(
        @repository(RunningAnalyticsRepository)
        private runningAnalyticsRepository: RunningAnalyticsRepository,

        @repository(ProfileAnalyticsRepository)
        private profileAnalyticsRepository: ProfileAnalyticsRepository,

        @repository(ResumeRepository)
        private resumeRepository: ResumeRepository,

        @repository(UserRepository)
        private userRepository: UserRepository,

        @inject('services.email.send')
        public emailService: EmailService,

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
                                scope: { fields: { email: true, fullName: true } }
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
                            ...(resumeId ? [{ resumeId }] : []),
                            ...(linkedInUrl ? [{ linkedInUrl }] : []),
                        ]
                    },
                    { isFoboPro }
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
    async getFoboAnalytics(requestBody: any, resume: any, analyticsId: number, requestId: any) {
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

            formData.append('X-apiKey', process.env.X_API_KEY || '');
            formData.append('X-request-id', requestId);
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

            if (response.status !== 200 || response.data?.status !== 'success') {
                throw new Error(response.data?.message || 'FOBO failed');
            }
            const analyticsData = await this.profileAnalyticsRepository.create({
                ...(resume?.id && { resumeId: resume.id }),
                ...(requestBody.linkedInUrl && { linkedInUrl: requestBody.linkedInUrl }),
                ...(resume?.id && { resumeId: resume.id }),
                ...(requestBody.linkedInUrl && { linkedInUrl: requestBody.linkedInUrl }),
                relevant_job_class: response.data.data?.relevant_job_class,
                FOBO_Score: response.data.data?.FOBO_Score,
                Augmented_Score: response.data.data?.Augmented_Score,
                Augmentation_Comment: response.data.data?.Augmentation_Comment,
                Automated_Score: response.data.data?.Automated_Score,
                Automated_Comment: response.data.data?.Automated_Comment,
                Human_Score: response.data.data?.Human_Score,
                AI_Readiness_Score: response.data.data?.AI_Readiness_Score,
                Human_Comment: response.data.data?.Human_Comment,
                Comment: response.data.data?.Comment,
                Strategy: response.data.data?.Strategy,
                Task_Distribution_Automation: response.data.data?.Task_Distribution_Automation,
                Task_Distribution_Human: response.data.data?.Task_Distribution_Human,
                Task_Distribution_Augmentation: response.data.data?.Task_Distribution_Augmentation,
                ...(requestBody.isFoboPro && {
                    analysis: response?.data?.data?.analysis,
                    skill_erosion_analysis: response?.data?.data?.skill_erosion_analysis,
                    automation_potential: response?.data?.data?.automation_potential,
                    strategic_objective_count: response?.data?.data?.strategic_objective_count,
                    transformation_timeline: response?.data?.data?.transformation_timeline
                }),
                ...(requestBody.isComprehensiveMode && {
                    json_schema_data: response?.data?.data?.json_schema_data,
                    json_file_url: response?.data?.data?.json_file_url,
                    markdown_file_url: response?.data?.data?.markdown_file_url,
                    comprehensive_analysis: response?.data?.data?.comprehensive_analysis
                }),
                isFoboPro: requestBody.isFoboPro ?? false,
            });

            await this.getWebhookFoboData({
                taskDistributionAutomation: response.data.data?.Task_Distribution_Automation,
                taskDistributionHuman: response.data.data?.Task_Distribution_Human,
                taskDistributionAugmentation: response.data.data?.Task_Distribution_Augmentation,
                userId: resume.userId
            });
            await this.updateRunningAnalytics(analyticsId, { status: 2 });

            return { success: true, analyticsData };
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
    async getFoboData(requestBody: any, requestId: any, resumeId?: number, currentUser?: User) {
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
            await this.updateRunningAnalytics(runningAnalytics.id, { status: 1 });

            if (requestBody.isFoboPro) {
                setImmediate(async () => {
                    await this.runFoboProcessing(resume, requestBody, runningAnalytics, requestId);
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
                runningAnalytics,
                requestId,
                currentUser
            );

            if (foboResponse.success) {
                const profileData = await this.profileAnalyticsRepository.findOne({
                    where: {
                        ...(resume?.id && { resumeId: resume.id }),
                        ...(linkedInUrl && { linkedInUrl }),
                    },
                    order: ['createdAt DESC'],
                });

                return {
                    success: true,
                    message: "FOBO Score Generated",
                    analytics: profileData,
                };
            }


            if (!currentUser || !currentUser.email) {
                return {
                    success: false,
                    message: 'Authenticated user required for FOBO success email',
                };
            }
            const foboFailOptions = {
                firstName: currentUser.fullName || 'User',
                to: currentUser.email,
            };

            const foboFailTemplate = generateFoboProFailTemplate(foboFailOptions);

            await this.emailService.sendMail({
                to: currentUser.email,
                subject: foboFailTemplate.subject,
                html: foboFailTemplate.html,
            });

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
    private async runFoboProcessing(resume: any, requestBody: any, runningAnalytics: any, requestId: any, currentUser?: User) {
        let count = runningAnalytics.trialCount || 0;

        for (; count < 3; count++) {
            const foboData = await this.getFoboAnalytics(requestBody, resume, runningAnalytics.id, requestId);

            if (foboData?.success) {
                await this.updateRunningAnalytics(runningAnalytics.id, {
                    trialCount: count,
                    status: 2,
                    isDeleted: true,
                });

                if (!currentUser || !currentUser.email) {
                    return {
                        success: false,
                        message: 'Authenticated user required for FOBO success email',
                    };
                }

                const siteUrl = process.env.REACT_APP_SITE_URL || 'https://www.altiv.ai';

                const foboSuccessOptions = {
                    firstName: currentUser.fullName || 'User',
                    to: currentUser.email,
                    foboUrl: `${siteUrl}/ai-readiness-analysis`,
                };

                const foboSuccessTemplate = generateFoboProSuccessTemplate(foboSuccessOptions);

                await this.emailService.sendMail({
                    to: currentUser.email,
                    subject: foboSuccessTemplate.subject,
                    html: foboSuccessTemplate.html,
                });

                return { success: true };
            }

            await this.updateRunningAnalytics(runningAnalytics.id, {
                trialCount: count,
                status: 3,
            });
        }

        await this.updateRunningAnalytics(runningAnalytics.id, {
            status: 3,
        });

        return { success: false };
    }

    // --------------------------------------------------
    // retry API
    // --------------------------------------------------
    async getRetryFoboData(resumeId: number, requestBody: any, requestId: any) {
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
                await this.getFoboAnalytics(requestBody, resume, analyticsId, requestId);
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

    // --------------------------------------------------
    // Webhook Api
    // --------------------------------------------------

    async getWebhookFoboData(data: any) {
        console.log('final data', data);

        if (data.userId) {
            const user = await this.userRepository.findById(data.userId);
            console.log('user', user);

            const payload = {
                EMAIL: user.email,
                attributes: {
                    FIRSTNAME: user.fullName,
                    LASTNAME: user.fullName || '',
                    PHONE: user.phoneNumber || '',
                    FOBO_SCORE: data.foboScore,
                    TASK_AUTO_1: data?.taskDistributionAutomation[0],
                    TASK_AUTO_2: data?.taskDistributionHuman[0],
                    TASK_AUTO_3: data?.taskDistributionAugmentation[0],
                },
                updateEnabled: true,
            };

            const apiResponse: any = await apiClient.post(
                'https://hook.us2.make.com/3y7ytrxay8isypgt7ayxhtcu27vehfaa',
                payload
            );

            console.log('apiResponse', apiResponse);

            return {
                success: true,
                apiResponse,
            };
        }
    }
}




