import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getCandidatesForPosition = async (positionId: number) => {
    const applications = await prisma.application.findMany({
        where: { positionId },
        include: {
            candidate: true,
            interviews: {
                select: { score: true }
            }
        }
    });

    return applications.map(application => {
        const scores = application.interviews
            .map(interview => interview.score)
            .filter((score): score is number => score !== null && score !== undefined);

        const averageScore = scores.length > 0
            ? scores.reduce((sum, score) => sum + score, 0) / scores.length
            : null;

        return {
            candidateId: application.candidate.id,
            fullName: `${application.candidate.firstName} ${application.candidate.lastName}`,
            currentInterviewStep: application.currentInterviewStep,
            averageScore
        };
    });
};
