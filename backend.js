const http = require("node:http");
const url = require("node:url");
const fs = require("node:fs");

let jsonData;

fs.readFile('en-US.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading JSON file:', err);
        process.exit(1);
    }
    jsonData = JSON.parse(data);
});

let server = http.createServer((request, response) => {
    let rUrl = url.parse(request.url, true);
    let pathname = rUrl.pathname;
    let query = rUrl.query;

    response.writeHead(200, "OK", {
        "Content-Type" : "application/json",
        "Access-Control-Allow-Origin" : "*"
    });

    let json = { Error: "Invalid request" };

    if (pathname == "/items") json = items(); //localhost:88/items
    if (pathname == "/tools") json = tools(); //localhost:88/tools
    if (pathname == "/foods") json = foods(); //localhost:88/foods

    if (pathname == "/item" && query.name) json = item(query); //localhost:88/item?name=Uranium Waste
    if (pathname == "/tool" && query.name) json = tool(query); //localhost:88/tool?name=Xeno-Basher
    if (pathname == "/food" && query.name) json = food(query); //localhost:88/food?name=Paleberry

    if (json.length == 0) json = { Error: "Invalid request" };
    response.end(JSON.stringify(json));
});

server.listen(88);
console.log("Server is running on port :88");

function items() {
    let data = []
    jsonData.forEach(item => {
        if (item.NativeClass == "/Script/CoreUObject.Class'/Script/FactoryGame.FGItemDescriptor'") {
            item.Classes.forEach(classItem => {
                data.push({ClassName : classItem.ClassName, mDisplayName: classItem.mDisplayName, mDescription: classItem.mDescription});
            });
        }
    });
    return [ ...data ];
}

function tools() {
    let data = []
    jsonData.forEach(item => {
        if (item.NativeClass == "/Script/CoreUObject.Class'/Script/FactoryGame.FGEquipmentDescriptor'") {
            item.Classes.forEach(classItem => {
                data.push({ClassName : classItem.ClassName, mDisplayName: classItem.mDisplayName, mDescription: classItem.mDescription});
            });
        }
    });
    return [ ...data ];
}

function foods() {
    let data = []
    jsonData.forEach(item => {
        if (item.NativeClass == "/Script/CoreUObject.Class'/Script/FactoryGame.FGConsumableDescriptor'") {
            item.Classes.forEach(classItem => {
                data.push({ClassName : classItem.ClassName, mDisplayName: classItem.mDisplayName, mDescription: classItem.mDescription});
            });
        }
    });
    return [ ...data ];
}

function item(query) {
    let data = []
    jsonData.forEach(item => {
        if (item.NativeClass == "/Script/CoreUObject.Class'/Script/FactoryGame.FGItemDescriptor'") {
            item.Classes.forEach(classItem => {
                if (classItem.mDisplayName == query.name) {
                    data.push(classItem)
                }
            });
        }
    });
    return [ ...data ];
}

function tool(query) {
    let data = []
    jsonData.forEach(item => {
        if (item.NativeClass == "/Script/CoreUObject.Class'/Script/FactoryGame.FGEquipmentDescriptor'") {
            item.Classes.forEach(classItem => {
                if (classItem.mDisplayName == query.name) {
                    data.push(classItem)
                }
            });
        }
    });
    return [ ...data ];
}

function food(query) {
    let data = []
    jsonData.forEach(item => {
        if (item.NativeClass == "/Script/CoreUObject.Class'/Script/FactoryGame.FGConsumableDescriptor'") {
            item.Classes.forEach(classItem => {
                if (classItem.mDisplayName == query.name) {
                    data.push(classItem)
                }
            });
        }
    });
    return [ ...data ];
}