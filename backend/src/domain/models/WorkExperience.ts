import { prisma } from '../../infrastructure/prisma';

export class WorkExperience {
    readonly id?: number;
    readonly company: string;
    readonly position: string;
    readonly description?: string;
    readonly startDate: Date;
    readonly endDate?: Date;
    candidateId?: number;

    constructor(data: any) {
        this.id = data.id;
        this.company = data.company;
        this.position = data.position;
        this.description = data.description;
        this.startDate = new Date(data.startDate);
        this.endDate = data.endDate ? new Date(data.endDate) : undefined;
        this.candidateId = data.candidateId;
    }

    async save() {
        const workExperienceData: any = {
            company: this.company,
            position: this.position,
            description: this.description,
            startDate: this.startDate,
            endDate: this.endDate
        };

        if (this.candidateId !== undefined) {
            workExperienceData.candidateId = this.candidateId;
        }

        if (this.id) {
            // Actualizar una experiencia laboral existente
            return await prisma.workExperience.update({
                where: { id: this.id },
                data: workExperienceData
            });
        } else {
            // Crear una nueva experiencia laboral
            return await prisma.workExperience.create({
                data: workExperienceData
            });
        }
    }
}