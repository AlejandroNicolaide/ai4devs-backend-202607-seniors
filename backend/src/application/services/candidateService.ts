import { prisma } from '../../infrastructure/prisma';
import { Candidate } from '../../domain/models/Candidate';
import { validateCandidateData } from '../validator';
import { Education } from '../../domain/models/Education';
import { WorkExperience } from '../../domain/models/WorkExperience';
import { Resume } from '../../domain/models/Resume';
import { CandidateInput, EducationInput, WorkExperienceInput, ResumeInput } from '../dto/candidateInput';

const saveEducations = async (candidate: Candidate, educations: EducationInput[], candidateId: number) => {
    for (const education of educations) {
        const educationModel = new Education(education);
        educationModel.candidateId = candidateId;
        await educationModel.save();
        candidate.education.push(educationModel);
    }
};

const saveWorkExperiences = async (candidate: Candidate, workExperiences: WorkExperienceInput[], candidateId: number) => {
    for (const experience of workExperiences) {
        const experienceModel = new WorkExperience(experience);
        experienceModel.candidateId = candidateId;
        await experienceModel.save();
        candidate.workExperience.push(experienceModel);
    }
};

const saveResume = async (candidate: Candidate, cv: ResumeInput, candidateId: number) => {
    const resumeModel = new Resume(cv);
    resumeModel.candidateId = candidateId;
    await resumeModel.save();
    candidate.resumes.push(resumeModel);
};

export const addCandidate = async (candidateData: CandidateInput) => {
    validateCandidateData(candidateData); // Validar los datos del candidato

    const candidate = new Candidate(candidateData); // Crear una instancia del modelo Candidate
    try {
        const savedCandidate = await candidate.save(); // Guardar el candidato en la base de datos
        const candidateId = savedCandidate.id; // Obtener el ID del candidato guardado

        if (candidateData.educations) {
            await saveEducations(candidate, candidateData.educations, candidateId);
        }

        if (candidateData.workExperiences) {
            await saveWorkExperiences(candidate, candidateData.workExperiences, candidateId);
        }

        if (candidateData.cv && Object.keys(candidateData.cv).length > 0) {
            await saveResume(candidate, candidateData.cv, candidateId);
        }

        return savedCandidate;
    } catch (error: any) {
        if (error.code === 'P2002') {
            // Unique constraint failed on the fields: (`email`)
            throw new Error('The email already exists in the database');
        } else {
            throw error;
        }
    }
};

export const findCandidateById = async (id: number): Promise<Candidate | null> => {
    try {
        const candidate = await Candidate.findOne(id); // Cambio aquí: pasar directamente el id
        return candidate;
    } catch (error) {
        console.error('Error al buscar el candidato:', error);
        throw error;
    }
};

export const updateCandidateStage = async (candidateId: number, applicationId: number, interviewStep: number) => {
    const application = await prisma.application.findUnique({ where: { id: applicationId } });

    if (!application) {
        throw new Error('Application not found');
    }
    if (application.candidateId !== candidateId) {
        throw new Error('This application does not belong to the specified candidate');
    }

    return await prisma.application.update({
        where: { id: applicationId },
        data: { currentInterviewStep: interviewStep }
    });
};
