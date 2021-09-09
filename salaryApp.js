document.getElementById("dialog-error").style.display = "none";
document.getElementById("dialog-record-count").style.display = "none";
document.getElementById("dialog-last-item").style.display = "none";
// Initialize Chart
function initializeChart(data) {
    var chartData = formatChartData(data);
    drawChart(chartData);
}

const formatChartData = function (data) {
    const chartItems = getChartItems(data);

    const dataWithUniqueName = uniquifyNames(chartItems);

    return [
        {
            key: "unnecessary data",
            values: dataWithUniqueName,
        },
    ];
};

const getChartItems = function (data) {
    const chartItems = [];
    for (const i in data) {
        chartItems.push(data[i]);
    }

    return chartItems;
};

const drawChart = function drawChart(data) {
    nv.addGraph(function () {
        const chart = nv.models
            .discreteBarChart()
            .x(function (d) {
                return d.name;
            })
            .y(function (d) {
                return parseFloat(d.salary);
            })
            .staggerLabels(true);
        d3.select("#chart svg").datum(data).call(chart);

        nv.utils.windowResize(chart.update);

        return chart;
    });
};

//save new item
document.addEventListener("DOMContentLoaded", () => {
    initializeChart(salary_data);
    document
        .getElementById("AddRecord")
        .addEventListener("click", addRecordHandler);
    const btnShowLast = document.getElementById("showLast");
    btnShowLast.addEventListener("click", function showLastHandler(e) {
        showLastItem();
    });

    document
        .getElementById("recordCount")
        .addEventListener("click", function recordCountHandler(e) {
            showRecordCountListener(salary_data);
        });

    window.setTimeout(function () {
        document
            .getElementById("recordCount")
            .setAttribute("class", "btn btn-success");
    }, 2000);
});

const showRecordCountListener = function (chartItems) {
    console.log(Object.values(chartItems).length);
    document.getElementById("dialog-record-count").style.display = "block";
    document.getElementById("dialog-record-count").innerHTML = `<h1>${
        Object.values(chartItems).length
    }</h1>`;
    document.getElementById("dialog-error").style.display = "none";
    document.getElementById("dialog-last-item").style.display = "none";
};

const initialCountListener = function () {
    const itemsObj = JSON.parse(this.responseText);
    const chartItems = getChartItems(itemsObj);
    document.getElementById("initial-count").innerText = chartItems.length;
};

function addRecordHandler() {
    const nameField = document.getElementById("name");
    const salaryField = document.getElementById("salary");
    const name = nameField.value;
    const salary = salaryField.value;
    nameField.value = "";
    salaryField.value = "";

    showData(name, salary);
    if (!name || !salary) {
        return;
    }

    addRecord(name, salary);
}

function addRecord(name, salary) {
    const newItem = getRecord(name, salary);
    const id = Math.ceil(Math.random() * 1000000000);

    salary_data[id] = newItem;
    initializeChart(salary_data);
}

function getRecord(name, salary) {
    const newItem = {
        name: name,
        salary: salary,
    };

    return newItem;
}

function secondHandler(e) {
    console.log("why are you clicking around????");
}

const showLastItem = function () {
    const items = salary_data;
    let lastKey;
    for (const key in items) {
        lastKey = key;
    }
    const lastItem = items[lastKey];
    const lastRecord = getRecord(lastItem.name, lastItem.salary);
    openModal("Last Item", lastItem.name, lastItem.salary);
    document.getElementById("dialog-error").style.display = "none";
    document.getElementById("dialog-record-count").style.display = "none";
    document.getElementById("dialog-last-item").style.display = "block";
    displayLastItemDialog(lastRecord);
};

const displayLastItemDialog = function (lastItem) {
    const dlg = document.getElementById("dialog-last-item");
    dlg.classList.remove("d-none");
    document.getElementById("showName").innerText = lastItem.name;
    document.getElementById("showSalary").innerText = d3.format(",.0f")(
        lastItem.salary
    );
};

var showData = function (name, salary) {
    const dlg = document.getElementById("dialog-error");
    dlg.classList.remove("d-none");

    toggleMessage("newName", name);
    toggleMessage("newSalary", salary);
};

function toggleMessage(selector, value) {
    if (!value) {
        document.getElementById(selector).innerText = `No ${selector.slice(3)}`;
    } else {
        document.getElementById(selector).innerText = `${value}`;
    }
    document.getElementById(selector).style.display = "inline";
    document.getElementById("dialog-error").style.display = "block";
    document.getElementById("dialog-record-count").style.display = "none";
    document.getElementById("dialog-last-item").style.display = "none";
}

const showRecordCount = function (data) {
    const dlg = document.getElementById("dialog-record-count");

    dlg.classList.remove("d-none");

    document.getElementById("numberOfRecords").innerText = data.length;
    document.getElementById("dialog-error").style.display = "none";
    document.getElementById("dialog-last-item").style.display = "none";
};

const anotherRecordCountHandler = function anotherRecordCountHandler(e) {
    console.log("you have extra click handler");
    for (let i = 0; i < 10; i++) {
        const isEven = i % 2 ? "odd" : "even";
        console.log(isEven);
    }
};

function longLineCode() {
    console.log("you have extra click handler");
    for (let i = 0; i < 10; i++) {
        const isEven = i % 2 ? "odd" : "even";
        console.log(isEven);
    }
}

/*
  bad data breaks code. Broken code needs more code to fix.
  and more code means higher job security. So, smile :)



  how it works: 
  we keep track of names in the "uniqueNames" object. 
  
  If a name exists in the uniqueNames object, you got a duplicate. 

  For a duplicate, you will add a white space
  to distinguish it from the previous one

  i hate writing comment. 
  need a coffee break!
*/

const uniquifyNames = function (items) {
    const uniqueNames = {};

    return items.map(function (item) {
        if (uniqueNames[item.name] !== undefined) {
            uniqueNames[item.name] += " ";
            item.name += uniqueNames[item.name];
        } else {
            uniqueNames[item.name] = "";
        }
        return item;
    });
};

const openModal = (label = "Modal", des1 = "", des2) => {
    const modalLabel1 = document.getElementById("modalLabel1");
    const modalBody1 = document.getElementById("modal-body1");
    modalLabel1.innerText = label;
    modalBody1.innerHTML = `
    <h1>${des1}</h1>
    ${des2 ? "<h1>Salary: " + des2 + " Taka</h1>" : ""}
    `;
};
