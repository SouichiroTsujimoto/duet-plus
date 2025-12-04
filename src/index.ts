import * as database from './database';

let args = [];
let tokuten_bunpu = "";

async function getGradeDistributionTable(id: string, year: string, c: string) {
    const gradeDistributions: database.GradeDistribution[] = await database.getGradeDistribution({id1: id, year: year});
    const gradeDistribution = gradeDistributions.length > 0 ? gradeDistributions[0] : null;

    // console.log(subject.data.getSubject);
    if(gradeDistribution != null) {
        let gpa = 0.0;
        const grades = [ `A: ${gradeDistribution.A.toFixed(1)}%`,
                         `B: ${gradeDistribution.B.toFixed(1)}%`,
                         `C: ${gradeDistribution.C.toFixed(1)}%`,
                         `D: ${gradeDistribution.D.toFixed(1)}%`,
                         `F: ${gradeDistribution.F.toFixed(1)}%`
                       ];
        if(c === "A") {
            grades[0] = "<span style=\"text-decoration:underline;color:blue;\">" + grades[0] + "</span>"
            gpa = 4.0;
        } else if(c === "B") {
            grades[1] = "<span style=\"text-decoration:underline;color:blue;\">" + grades[1] + "</span>"
            gpa = 3.0;
        } else if(c === "C") {
            grades[2] = "<span style=\"text-decoration:underline;color:blue;\">" + grades[2] + "</span>"
            gpa = 2.0;
        } else if(c === "D") {
            grades[3] = "<span style=\"text-decoration:underline;color:blue;\">" + grades[3] + "</span>"
            gpa = 1.0;
        } else if(c === "F") {
            grades[4] = "<span style=\"text-decoration:underline;color:blue;\">" + grades[4] + "</span>"
            gpa = 0.0;
        }

        let score = 
            c !== ""
            ? `取得したGP: <span style="color:red;">${gpa.toFixed(1)}</span>　(平均GP: <span style="color:green;">${gradeDistribution.average.toFixed(1)}</span>)`
            : "";
            
        // console.log(res);
        return [score + "<br />" + grades.join("　"), gradeDistribution.average];
    } else {
        return ["", undefined];
    }
}

const topic_path = document.querySelector('#header #topic_path a');

if(topic_path?.textContent !== undefined) {
    console.log(topic_path.textContent.trim());

    if(topic_path.textContent.trim() === "成績確認") {
        const trlist = document.querySelectorAll('.curriculum tbody tr');

        const updataTr = async() => {
            let gpaSum = 0;
            let subjectCounter = 0;

            for(const tr of trlist){
                console.log(tr);
                const subjectName = tr.children[2].textContent?.trim();
                const credit = tr.children[3].textContent?.trim();
                const grade = tr.children[4].textContent?.trim();
                // console.log(subjectName);
                // console.log(tr.children[6].children[0].children.length);
                if(tr.children[6].children[0].children.length === 1) {
                    tokuten_bunpu = tr.children[6].children[0].children[0].children[0].getAttribute("onclick") ?? "";
                    // console.log(tr.children[6].children[0].children[0].children[0]);

                    args = tokuten_bunpu.split("'");
                    
                    const id = args[7]; // + '-' + args[9] + "-2024-春";
                    // console.log(`検索id: ${id}`);
                    const year = args[3];
                    const [info, gpaAve] = await getGradeDistributionTable(id, year, grade ?? "");

                    if(gpaAve !== undefined) {
                        // console.log(gpaAve);

                        gpaSum += gpaAve as number * Number(credit);
                        subjectCounter += Number(credit);

                        tr.children[2].innerHTML = tr.children[2].innerHTML + "<br />" + info;
                    } else { 
                        // tr.children[2].innerHTML = tr.children[2].innerHTML;
                    }

                }
            }

            console.log(`gpaSum: ${gpaSum}`);
            console.log(`subjectCounter: ${subjectCounter}`);
            return gpaSum / subjectCounter;
        }

        (async() => {
            const gpaAveAll = await updataTr();

            const evenlist = document.querySelectorAll('.even');
            evenlist.item(1).children[1].innerHTML = evenlist.item(1).children[1].innerHTML + "<br />(受講した科目全体の平均GPA: " + gpaAveAll.toFixed(2)  + ")"; 
        })();

    }
}
