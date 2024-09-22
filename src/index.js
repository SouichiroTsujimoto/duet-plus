import * as database from './database';
import { jsondatas } from './jsondata';

let b = true;
let args = [];
let tokuten_bunpu = "";

async function callTokutenBunpuWithGrade(id, c) {
    let subject = await database.getSubject(id);

    // console.log(subject.data.getSubject);
    if(subject.data.getSubject != null) {
        let gpa = 0.0;
        let grades = [ `A: ${subject.data.getSubject.A.toFixed(1)}%`,
                    `B: ${subject.data.getSubject.B.toFixed(1)}%`,
                    `C: ${subject.data.getSubject.C.toFixed(1)}%`,
                    `D: ${subject.data.getSubject.D.toFixed(1)}%`,
                    `F: ${subject.data.getSubject.F.toFixed(1)}%`
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
            ? `取得したGP: <span style="color:red;">${gpa.toFixed(1)}</span>　(平均GP: <span style="color:green;">${subject.data.getSubject.average.toFixed(1)}</span>)`
            : "";
            
        // console.log(res);
        return [score + "<br />" + grades.join("　"), subject.data.getSubject.average];
    } else {
        return ["", -1];
    }
}

async function callTokutenBunpuWithNameAndYearAndSemester(id1, name, year, semester) {
    let subjects = await database.getSubjectById1AndYear(id1, year);

    // console.log(subjects.data.getSubjectById1AndYear);

    let pattern = /他$/g;

    let teacherName = name.replace(pattern, "").trim();

    console.log(`teacherName: ${teacherName}`);

    if(subjects.data.getSubjectById1AndYear.items.length == 1) {
        let subject = subjects.data.getSubjectById1AndYear.items[0];
        return callTokutenBunpuWithGrade(subject.id, ""); 
    }

    for(const subject of subjects.data.getSubjectById1AndYear.items) {
        if(subject.teacher.includes(teacherName) && subject.semester == semester) {
            return callTokutenBunpuWithGrade(subject.id, "");
        }
    }
    
    return ["", -1];
}

let topic_path = document.querySelector('#header #topic_path a');

console.log(topic_path.textContent.trim());

if(topic_path.textContent.trim() == "成績確認") {
    let trlist = document.querySelectorAll('.curriculum tbody tr');

    const updataTr = async() => {
        let gpaSum = 0;
        let subjectCounter = 0;

        for(const tr of trlist){
            console.log(tr);
            let subjectName = tr.children[2].textContent.trim();
            let credit = tr.children[3].textContent.trim();
            let grade = tr.children[4].textContent.trim();
            // console.log(subjectName);
            // console.log(tr.children[6].children[0].children.length);
            if(tr.children[6].children[0].children.length == 1) {
                tokuten_bunpu = tr.children[6].children[0].children[0].children[0].getAttribute("onclick");
                // console.log(tr.children[6].children[0].children[0].children[0]);

                args = tokuten_bunpu.split("'");
                
                let id = args[7] + '-' + args[9] + "-2024-春";
                // console.log(`検索id: ${id}`);
                let [info, gpaAve] = await callTokutenBunpuWithGrade(id, grade);

                if(gpaAve != -1) {
                    // console.log(gpaAve);

                    gpaSum += gpaAve * Number(credit);
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

} else if(topic_path.textContent.trim() == "先行登録") {
    let subjectList = document.querySelectorAll('a[onclick$="doAction(\'form1\',\'goKamokuLinkCurriculumHyo\');"],a[onclick$="doAction(\'form1\',\'goKamokuLinkCurriculum\');"]');
    // console.log(subjectList)

    let pattern = /\d{8}\_\d+/g;

    const overwriteSubjct = async() => {
        for(let subject of subjectList) {
            // console.log(subject.attributes);
            let subjectId = subject.getAttribute("onclick").match(pattern)[0];
            if(subjectId != null) {
                let teacherName = subject.parentElement.parentElement.children[2].textContent.trim();
                console.log(teacherName);

                let [subjectId1, subjectId2] = [subjectId.split('_')[0], subjectId.split('_')[1]];
                
                // id後半が三桁以下の時、頭に0を付けたす
                subjectId2 = subjectId2.length == 1 ? subjectId2 = "00" + subjectId2 : subjectId2;
                subjectId2 = subjectId2.length == 2 ? subjectId2 = "0" + subjectId2 : subjectId2;

                let [info, gpaAve] = await callTokutenBunpuWithNameAndYearAndSemester(subjectId1, teacherName, 2023, "秋");

                let newDiv = document.createElement("div");
                if(gpaAve != -1){
                    newDiv.innerHTML = info;
                } else {
                    newDiv.innerHTML = "<br />担当者不明、もしくはこのIDと担当者の一致する昨年のデータがありません"
                }

                subject.parentElement.appendChild(newDiv);
            }
        }
    }
    
    overwriteSubjct();
//
// // 以下のコメントアウト部分は、データを新しく追加するときのみ使用
//
// } else {
//     (async() => {
//         // await database.deleteAllSubjects();

//         console.log("ここからcreateSubject");

        
//         for await(const section of jsondatas) {
//             // for await(const section of jsondata) {
//             console.log("section.length")
//             console.log(section.length);
//             for await(const data of section) {
//                 if(data[5] != '') {
//                     let [id1, id2] = [data[0].split('-')[0], data[0].split('-')[1]];
//                     console.log([id1, id2]);
//                     let p = {
//                         id: data[0] + "-2023-秋",
//                         id1: id1,
//                         id2: id2,
//                         year: 2023,
//                         semester: "秋",
//                         name: data[2],
//                         number: data[4],
//                         A: data[5],
//                         B: data[6],
//                         C: data[7],
//                         D: data[8],
//                         F: data[9],
//                         other: data[10],
//                         average: data[11],
//                         teacher: data[3],
//                     };
//                     try {
//                         await database.createSubject(p);
//                     } catch(e) {
//                         console.error(e);
//                         console.log(p);
//                     }
//                 }
//                 // }
//             }
//         }

//         console.log("ここからgetAllSubjects");

//         await database.getAllSubejects();

//         // await database.getSubjectById1AndYear("11900001");

//         // await database.getSubjectById1AndYear("11900001", 2023);

//         // await database.getSubjectById1AndYear("11900001", 2024);
    
//         // await database.deleteAllSubjects();
//     })();
}



// $('#selectedIndex').val

// $('a[href^="example"]')  memo: https://swfz.hatenablog.com/entry/2023/07/15/183739