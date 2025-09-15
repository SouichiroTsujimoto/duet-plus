import * as database from './database';

let b = true;
let args = [];
let tokuten_bunpu = "";

async function getGradeDistributionTable(id: string, year: string, c: string) {
    let gradeDistributions: database.GradeDistribution[] = await database.getGradeDistribution({id1: id, year: year});
    let gradeDistribution = gradeDistributions.length > 0 ? gradeDistributions[0] : null;

    // console.log(subject.data.getSubject);
    if(gradeDistribution != null) {
        let gpa = 0.0;
        let grades = [ `A: ${gradeDistribution.A.toFixed(1)}%`,
                    `B: ${gradeDistribution.B.toFixed(1)}%`,
                    `C: ${gradeDistribution.C.toFixed(1)}%`,
                    `D: ${gradeDistribution.D.toFixed(1)}%`,
                    `F: ${gradeDistribution.F.toFixed(1)}%`
                ];
        if(c == "A") {
            grades[0] = "<span style=\"text-decoration:underline;color:blue;\">" + grades[0] + "</span>"
            gpa = 4.0;
        } else if(c == "B") {
            grades[1] = "<span style=\"text-decoration:underline;color:blue;\">" + grades[1] + "</span>"
            gpa = 3.0;
        } else if(c == "C") {
            grades[2] = "<span style=\"text-decoration:underline;color:blue;\">" + grades[2] + "</span>"
            gpa = 2.0;
        } else if(c == "D") {
            grades[3] = "<span style=\"text-decoration:underline;color:blue;\">" + grades[3] + "</span>"
            gpa = 1.0;
        } else if(c == "F") {
            grades[4] = "<span style=\"text-decoration:underline;color:blue;\">" + grades[4] + "</span>"
            gpa = 0.0;
        }

        let score = 
            c != ""
            ? `取得したGP: <span style="color:red;">${gpa.toFixed(1)}</span>　(平均GP: <span style="color:green;">${gradeDistribution.average.toFixed(1)}</span>)`
            : "";
            
        // console.log(res);
        return [score + "<br />" + grades.join("　"), gradeDistribution.average];
    } else {
        return ["", undefined];
    }
}

// 教員の名前を整形してから検索(科目登録などの時期に見直す)
//
// async function callTokutenBunpuWithNameAndYearAndSemester(id1, name, year, semester) {
//     let subjects = await database.getSubjectById1AndYear(id1, year);

//     // console.log(subjects.data.getSubjectById1AndYear);

//     let pattern = /他$/g;

//     let teacherName = name.replace(pattern, "").trim();

//     console.log(`teacherName: ${teacherName}`);

//     if(subjects.data.getSubjectById1AndYear.items.length == 1) {
//         let subject = subjects.data.getSubjectById1AndYear.items[0];
//         return callTokutenBunpuWithGrade(subject.id, ""); 
//     }

//     for(const subject of subjects.data.getSubjectById1AndYear.items) {
//         if(subject.teacher.includes(teacherName) && subject.semester == semester) {
//             return callTokutenBunpuWithGrade(subject.id, "");
//         }
//     }
    
//     return ["", -1];
// }

let topic_path = document.querySelector('#header #topic_path a');

if(topic_path?.textContent != undefined) {
    console.log(topic_path.textContent.trim());

    if(topic_path.textContent.trim() == "成績確認") {
        let trlist = document.querySelectorAll('.curriculum tbody tr');

        const updataTr = async() => {
            let gpaSum = 0;
            let subjectCounter = 0;

            for(const tr of trlist){
                console.log(tr);
                let subjectName = tr.children[2].textContent?.trim();
                let credit = tr.children[3].textContent?.trim();
                let grade = tr.children[4].textContent?.trim();
                // console.log(subjectName);
                // console.log(tr.children[6].children[0].children.length);
                if(tr.children[6].children[0].children.length == 1) {
                    tokuten_bunpu = tr.children[6].children[0].children[0].children[0].getAttribute("onclick") ?? "";
                    // console.log(tr.children[6].children[0].children[0].children[0]);

                    args = tokuten_bunpu.split("'");
                    
                    let id = args[7]; // + '-' + args[9] + "-2024-春";
                    // console.log(`検索id: ${id}`);
                    let year = args[3];
                    let [info, gpaAve] = await getGradeDistributionTable(id, year, grade ?? "");

                    if(gpaAve != undefined) {
                        // console.log(gpaAve);

                        gpaSum += gpaAve as number * Number(credit);
                        subjectCounter += Number(credit);

                        tr.children[2].innerHTML = tr.children[2].innerHTML + "<br />" + info;
                    } else { 
                        tr.children[2].innerHTML = tr.children[2].innerHTML;
                    }

                }
            }

            console.log(`gpaSum: ${gpaSum}`);
            console.log(`subjectCounter: ${subjectCounter}`);
            return gpaSum / subjectCounter;
        }

        (async() => {
            let gpaAveAll = await updataTr();

            let evenlist = document.querySelectorAll('.even');
            evenlist.item(1).children[1].innerHTML = evenlist.item(1).children[1].innerHTML + "<br />(受講した科目全体の平均GPA: " + gpaAveAll.toFixed(2)  + ")"; 
        })();

    } //else if(topic_path.textContent.trim() == "先行登録") {
    //     let subjectList = document.querySelectorAll('a[onclick$="doAction(\'form1\',\'goKamokuLinkCurriculumHyo\');"],a[onclick$="doAction(\'form1\',\'goKamokuLinkCurriculum\');"]');
    //     // console.log(subjectList)

    //     let pattern = /\d{8}\_\d+/g;

    //     const overwriteSubjct = async() => {
    //         for(let subject of subjectList) {
    //             // console.log(subject.attributes);
    //             let subjectId = subject.getAttribute("onclick")?.match(pattern)?.[0];
    //             if(subjectId != null) {
    //                 let teacherName = subject.parentElement?.parentElement?.children[2].textContent?.trim();
    //                 console.log(teacherName);

    //                 let [subjectId1, subjectId2] = [subjectId.split('_')[0], subjectId.split('_')[1]];
                    
    //                 // id後半が三桁以下の時、頭に0を付けたす
    //                 subjectId2 = subjectId2.length == 1 ? subjectId2 = "00" + subjectId2 : subjectId2;
    //                 subjectId2 = subjectId2.length == 2 ? subjectId2 = "0" + subjectId2 : subjectId2;

    //                 let [info, gpaAve] = await callTokutenBunpuWithNameAndYearAndSemester(subjectId1, teacherName, 2023, "秋");

    //                 let newDiv = document.createElement("div");
    //                 if(gpaAve != -1){
    //                     newDiv.innerHTML = info;
    //                 } else {
    //                     newDiv.innerHTML = "<br />担当者不明、もしくはこのIDと担当者の一致する昨年のデータがありません"
    //                 }

    //                 subject.parentElement.appendChild(newDiv);
    //             }
    //         }
    //     }
        
    //     overwriteSubjct();
    
    // }
}
