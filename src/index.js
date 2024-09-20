import * as database from './database';
import { jsondata } from './jsondata';

let b = true;
let args = [];
let tokuten_bunpu = "";

async function callTokutenBunpu(id, c) {
    let kamoku = await database.getKamoku(id);

    console.log(kamoku.data.getKamoku);
    if(kamoku.data.getKamoku != null) {
        let gpa = 0.0;
        let grades = [ `A: ${kamoku.data.getKamoku.A.toFixed(1)}%`,
                    `B: ${kamoku.data.getKamoku.B.toFixed(1)}%`,
                    `C: ${kamoku.data.getKamoku.C.toFixed(1)}%`,
                    `D: ${kamoku.data.getKamoku.D.toFixed(1)}%`,
                    `F: ${kamoku.data.getKamoku.E.toFixed(1)}%`
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

        let score = `取得したGP: <span style="color:red;">${gpa.toFixed(1)}</span>　(平均GP: <span style="color:green;">${kamoku.data.getKamoku.average.toFixed(1)}</span>)`;

        // console.log(res);
        return [score + "<br />" + grades.join("　"), kamoku.data.getKamoku.average];
    } else {
        return ["", -1];
    }
}

let topic_path = document.querySelector('#header #topic_path a');

console.log(topic_path.textContent.trim());

if(topic_path.textContent.trim() == "成績確認") {
    let trlist = document.querySelectorAll('.curriculum tbody tr');

    const updataTr = async() => {
        let gpaSum = 0;
        let kamokuCounter = 0;

        for(const tr of trlist){
            console.log(tr);
            let kamoku_name = tr.children[2].textContent.trim();
            let score = tr.children[4].textContent.trim();
            console.log(kamoku_name);
            console.log(tr.children[6].children[0].children.length);
            if(tr.children[6].children[0].children.length == 1) {
                tokuten_bunpu = tr.children[6].children[0].children[0].children[0].getAttribute("onclick");
                // console.log(tr.children[6].children[0].children[0].children[0]);

                args = tokuten_bunpu.split("'");
                
                let id = args[7] + '-' + args[9];
                // console.log(`検索id: ${id}`);
                let [info, gpaAve] = await callTokutenBunpu(id, score);

                if(gpaAve != -1) {
                    console.log(gpaAve);

                    gpaSum += gpaAve;
                    kamokuCounter++;

                    tr.children[2].innerHTML = tr.children[2].innerHTML + "<br />" + info;
                } else { 
                    tr.children[2].innerHTML = tr.children[2].innerHTML;
                }

            }
        }

        console.log(gpaSum);
        console.log(kamokuCounter);
        return gpaSum / kamokuCounter;
    }

    (async() => {
        let gpaAveAll = await updataTr();

        let evenlist = document.querySelectorAll('.even');
        evenlist.item(1).children[1].innerHTML = evenlist.item(1).children[1].innerHTML + "<br />(受講した科目全体の平均GPA: " + gpaAveAll.toFixed(2)  + ")"; 
    })();

    // (async() => {
    //     await console.log("-----------");

    //     await database.getAll();
    // })();

    /*
    (async() => {
        // await database.deleteAll();

        console.log("ここからcreateKamoku");

        console.log("jsondata.length")
        console.log(jsondata.length);

        for await(const section of jsondata) {
            console.log("section.length")
            console.log(section.length);
            for await(const data of section) {
                if(data[5] != '') {
                    try {
                        await database.createKamoku({
                            id: data[0],
                            name: data[2],
                            number: data[4],
                            A: data[5],
                            B: data[6],
                            C: data[7],
                            D: data[8],
                            E: data[9],
                            F: data[10],
                            average: data[11],
                        });
                    } catch(e) {
                        console.error(e);
                        console.log(data);
                    }
                }
            }
        }

        console.log("ここからgetAll");

        await database.getAll();
    })();
    */
}