let b = true;
let args = [];
let tokuten_bunpu = "";

let trlist = document.querySelectorAll('.curriculum tbody tr');
trlist.forEach(async (tr) => {
    console.log(tr);
    let kamoku_name = tr.children[2].children[0];
    console.log(tr.children[6].children[0].children.length);
    if(tr.children[6].children[0].children.length == 1) {
        tokuten_bunpu = tr.children[6].children[0].children[0].children[0].getAttribute("onclick");
        // console.log(tr.children[6].children[0].children[0].children[0]);

        args = tokuten_bunpu.split("'");
        callTokutenBunpu(args[1], args[3], args[5], args[7], args[9]);
    } 

    kamoku_name.textContent = kamoku_name.textContent + "　/ ここに表示したい / ";
});


// onclick="return callTokutenBunpu('https://duet.doshisha.ac.jp/kokai/html/fi/fi020/FI02001G.html','2024','10','11655010','000');"

// onclick="return callTokutenBunpu('https://duet.doshisha.ac.jp/kokai/html/fi/fi020/FI02001G.html','2024','10','11655005','000');"
