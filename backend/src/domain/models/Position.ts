import { prisma } from '../../infrastructure/prisma';

export class Position {
    readonly id?: number;
    readonly companyId: number;
    readonly interviewFlowId: number;
    readonly title: string;
    readonly description: string;
    readonly status: string;
    readonly isVisible: boolean;
    readonly location: string;
    readonly jobDescription: string;
    readonly requirements?: string;
    readonly responsibilities?: string;
    readonly salaryMin?: number;
    readonly salaryMax?: number;
    readonly employmentType?: string;
    readonly benefits?: string;
    readonly companyDescription?: string;
    readonly applicationDeadline?: Date;
    readonly contactInfo?: string;

    constructor(data: any) {
        this.id = data.id;
        this.companyId = data.companyId;
        this.interviewFlowId = data.interviewFlowId;
        this.title = data.title;
        this.description = data.description;
        this.status = data.status ?? 'Draft';
        this.isVisible = data.isVisible ?? false;
        this.location = data.location;
        this.jobDescription = data.jobDescription;
        this.requirements = data.requirements;
        this.responsibilities = data.responsibilities;
        this.salaryMin = data.salaryMin;
        this.salaryMax = data.salaryMax;
        this.employmentType = data.employmentType;
        this.benefits = data.benefits;
        this.companyDescription = data.companyDescription;
        this.applicationDeadline = data.applicationDeadline ? new Date(data.applicationDeadline) : undefined;
        this.contactInfo = data.contactInfo;
    }

    async save() {
        const positionData: any = {
            companyId: this.companyId,
            interviewFlowId: this.interviewFlowId,
            title: this.title,
            description: this.description,
            status: this.status,
            isVisible: this.isVisible,
            location: this.location,
            jobDescription: this.jobDescription,
            requirements: this.requirements,
            responsibilities: this.responsibilities,
            salaryMin: this.salaryMin,
            salaryMax: this.salaryMax,
            employmentType: this.employmentType,
            benefits: this.benefits,
            companyDescription: this.companyDescription,
            applicationDeadline: this.applicationDeadline,
            contactInfo: this.contactInfo,
        };

        if (this.id) {
            return await prisma.position.update({
                where: { id: this.id },
                data: positionData,
            });
        } else {
            return await prisma.position.create({
                data: positionData,
            });
        }
    }

    static async findOne(id: number): Promise<Position | null> {
        const data = await prisma.position.findUnique({
            where: { id: id },
        });
        if (!data) return null;
        return new Position(data);
    }
}

