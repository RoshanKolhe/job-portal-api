import { repository } from "@loopback/repository";
import { ProfileAnalyticsRepository, ResumeRepository, RunningAnalyticsRepository } from "../repositories";
import { HttpErrors } from "@loopback/rest";
import FormData from "form-data";
import fs from 'fs';
import path from 'path';
import { STORAGE_DIRECTORY } from "../keys";
import { inject } from "@loopback/core";
import apiClient from "../interceptors/axios-client.interceptor";

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

    // get existing running analytics...
    async getRunningAnalytics(resumeId: number) {
        const runningAnalytics = await this.runningAnalyticsRepository.findOne({
            where: {
                resumeId: resumeId,
                // isDeleted: false
            },
            order: ['createdAt DESC']
        });

        if (!runningAnalytics) {
            const newRunningAnalytics = await this.runningAnalyticsRepository.create({
                resumeId,
                status: 0,
                trialCount: 0,
                isDeleted: false
            });

            return newRunningAnalytics;
        }

        return runningAnalytics;
    }

    // update running analytics...
    async updateRunningAnalytics(analyticsId: number, updatedData: object) {
        await this.runningAnalyticsRepository.updateById(analyticsId, updatedData);

        const updatedAnalytics = await this.runningAnalyticsRepository.findById(analyticsId);

        return updatedAnalytics;
    }

    // validate file name
    private validateFileName(fileName: string) {
        const resolved = path.resolve(this.storageDirectory, fileName);
        if (resolved.startsWith(this.storageDirectory)) return resolved;
        // The resolved file is outside sandbox
        throw new HttpErrors.BadRequest(`Invalid file name: ${fileName}`);
    }

    // get fobo analytics...
    async getFoboAnalytics(requestBody: any, resume: any) {
        try {
            let fields: { [key: string]: boolean } = {
                analysis: false,
                skill_erosion_analysis: false,
                json_schema_date: false,
                json_file_url: false,
                markdown_file_url: false,
                comprehensive_analysis: false,
            };

            if (requestBody.isFoboPro) {
                fields = {
                    json_schema_date: false,
                    json_file_url: false,
                    markdown_file_url: false,
                    comprehensive_analysis: false,
                }
            }

            if (requestBody.isComprehensiveMode) {
                fields = {};
            }
            const formData = new FormData();

            // Attach resume file if available
            if (resume?.fileDetails?.newFileName) {
                const filePath = this.validateFileName(resume.fileDetails.newFileName);
                formData.append('file', fs.createReadStream(filePath));
            }

            formData.append('user_id', resume?.userId ? String(resume.userId) : '1');

            if (requestBody.linkedInUrl && requestBody.linkedInUrl !== '') {
                formData.append('linkedin_url', requestBody.linkedInUrl);
            }

            formData.append('X-apiKey', 2472118222258182);
            if (!requestBody.isComprehensiveMode) {
                formData.append('short_task_description', String(requestBody.viewDetails));
            } else {
                formData.append('comprehensive_mode', String(requestBody.isComprehensiveMode));
            }
            formData.append('use_resume', String(requestBody.smartInsights));

            if (requestBody.isFoboPro) {
                formData.append('pro_mode', String(true))
            }

            const response: any = await apiClient.post(`${process.env.SERVER_URL}/fobo`, formData, {
                headers: formData.getHeaders(),
            });

            if (response?.data?.status === 'success' && response?.data?.data) {
                const analyticsData = await this.profileAnalyticsRepository.create({
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
                    isFoboPro: requestBody.isFoboPro ?? false
                });

                if (analyticsData) {
                    return {
                        success: true,
                        message: 'New Profile Analytics data',
                        return: analyticsData
                    };
                }
            }

            if (response?.data?.status === 'error' && response?.data?.data === null) {
                console.log('error', response?.data);
                throw new HttpErrors.InternalServerError('FOBO service failed');
            }
        } catch (error) {
            console.log('error while fetching fobo analytics :', error);
            return {
                success: false,
                errorMessage: error?.error?.message || 'FOBO service failed'
            }
        }
    }

    async getFoboData(resumeId: number, requestBody: any) {
        const resume = await this.resumeRepository.findById(resumeId);
        if (!resume) throw new HttpErrors.NotFound('Resume not found');

        const runningAnalytics = await this.getRunningAnalytics(resumeId);

        const isPro = requestBody.isFoboPro === true;

        // 🔹 Case: Processing already going on
        if (runningAnalytics.status === 1) {
            return {
                success: true,
                message: "Processing... Check again in 2-5 minutes",
                status: 1,
            };
        }

        // 🔹 Retry + process only if not errored completely
        if (runningAnalytics.status === 0 && runningAnalytics.id) {
            await this.updateRunningAnalytics(runningAnalytics.id, { status: 1 });

            if (isPro) {
                // 🔥 FOBO PRO — Background processing only, no waiting 🚀
                setImmediate(async () => {
                    await this.runFoboProcessing(resume, requestBody, runningAnalytics);
                });

                return {
                    success: true,
                    message: "FOBO Pro started... You can check later",
                    status: 1,
                };
            } else {
                // 🟡 Normal — WAIT FOR RESULT (synchronous style)
                const foboResponse = await this.runFoboProcessing(resume, requestBody, runningAnalytics);

                if (foboResponse.success) {
                    const profileData = await this.profileAnalyticsRepository.findOne({
                        where: { resumeId },
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
        }

        return {
            success: false,
            message: "No analytics found or invalid processing state.",
        };
    }

    // 🔁 Extracted background retry logic into a reusable function
    private async runFoboProcessing(resume: any, requestBody: any, runningAnalytics: any) {
        let count = runningAnalytics.trialCount || 0;

        for (; count < 3; count++) {
            const foboData = await this.getFoboAnalytics(requestBody, resume);

            if (foboData?.success) {
                await this.updateRunningAnalytics(runningAnalytics.id, {
                    trialCount: count,
                    status: 2,
                    isDeleted: true,
                });
                return { success: true };
            }

            await this.updateRunningAnalytics(runningAnalytics.id!, {
                trialCount: count,
                status: 3,
                error: foboData?.errorMessage || "FOBO service failed",
            });
        }

        await this.updateRunningAnalytics(runningAnalytics.id!, {
            status: 3,
            error: "Retry limit reached",
        });

        return { success: false };
    }
}