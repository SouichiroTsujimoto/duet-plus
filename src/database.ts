export type TargetSubject = {
    id1: string;
    id2?: string;
    year: string;
    semester?: string;
    teacher?: string;
}

export type GradeDistribution = {
    A:        number;
    B:        number;
    C:        number;
    D:        number;
    F:        number;
    average:  number;
    id1:      string;
    id2:      string;
    name:     string;
    number:   number;
    other:    number;
    semester: string;
    teacher:  string;
    year:     string;
}

export async function getGradeDistribution(target: TargetSubject): Promise<GradeDistribution[]> {
    // console.log(`id1: ${id1}`);
        
    const url = "https://duet-plus-backend.souichiroug.workers.dev/api/gradeDistribution";
    
    try {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify(target),
        });
        if (!response.ok) {
            throw new Error(`レスポンスステータス: ${response.status}`);
        }

        const json = await response.json();
        return json;
    } catch (e: any) {
        console.error(e.message);
    }

    return [] as GradeDistribution[];
}

