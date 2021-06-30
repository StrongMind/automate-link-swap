
context("CDS", () => {
    it("swaps links", () => {

        const rows = `{PASTE ROWS FROM SPREADSHEET (COLUMNS B-I) HERE}`;

        const parsed = parse(rows);
        console.log(parsed);
        for (const input of parsed) {
            openLesson(input);
        }
       
    });
    
});

function openLesson(inputs) {
    cy.request({
        method: "GET",
        url: "https://cds.flipswitch.com/",
        headers: {
            Cookie: `{PASTE COOKIE HERE}`
        }
    })
    .then(()=> {

        cy.visit(inputs.lessonUrl);
        
        cy.wait(5000);

        
        
        addActivity(inputs);

        //sortActivity(inputs);

        //deleteActivity(inputs, true);

        
    });
}

function sortActivity(inputs) {
    let lineItem = cy.get(".row-link").first().parentsUntil(".row-lineitem").parent();
    lineItem.within(() => {
        cy.get(`.menu-area`).trigger('mouseover');
        cy.get(`.btn-group`).click();
        cy.get(`li[data-bind="click:sort"]`).click();
    });
}
function deleteActivity(inputs, last) {
    let lineItem = null;
    if (last) 
    {
        lineItem = cy.get(".row-link").contains(inputs.title).last().parentsUntil(".row-lineitem").parent();
    }
    else 
    {
        lineItem = cy.get(".row-link").contains(inputs.title).parentsUntil(".row-lineitem").parent();
    }
    lineItem.within(() => {
        cy.get(`.menu-area`).trigger('mouseover');
        cy.get(`.btn-group`).click();
        cy.get(`li[data-bind="click:remove"]`).click();
    });
}

function addActivity(inputs) {
    cy.get('#addActivityBtn > .btn').click();
    cy.get('[data-type="Question Assessment"] > .hover').click();

    cy.get(`.form-control[placeholder="Input a Title (required)"]`).type(inputs.title, { delay: 0 });
    cy.wait(1000);
    cy.get(`.form-control[placeholder="Input a Title (required)"]`).last().clear().type(inputs.title, { delay: 0 });

    cy.get(`select.form-control`).first().select(inputs.gradeCategory);

    cy.get(`[params="title:'Attempts', value: attempts, maxLength: 3, defaultValue: 1, nullStateEnabled: false, measurementTitle: ' ' "] > .form-group > .col-sm-5 > .pull-left > .form-control`).clear().type(inputs.attempts);

    cy.get(`select.form-control`).last().select(inputs.gradingType);

    cy.get('.col-sm-8 > .checkbox > label').click();

    cy.get('[style="margin-right: 10px; width: 50%;"] > .form-control').type(inputs.launchUrl, { delay: 0 });

    cy.get('.menu-area-alt > .btn-primary').click();
}



function parse(tsvRows) {
    const output = [];
    const rows = tsvRows.split("\n");
    for (const row of rows) {
        const cols = row.split("\t");
        const obj = {
            lessonUrl: cols[0].trim(),
            title: cols[2].trim(),
            gradeCategory: cols[3].trim(),
            attempts: cols[4].trim(),
            gradingType: cols[5].trim(),
            launchUrl: cols[6].trim()
        }
        if (obj.gradeCategory == "Warm-Up")
        {
            obj.gradeCategory = "Warm-Up/Independent Practice";
        }
        output.push(obj);
    }
    return output;
}