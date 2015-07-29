
// Set up a client and patient ID to talk to an un-authenticated FHIR server
  var client = jqFhir({ baseUrl: 'http://fhirtest.uhn.ca/baseDstu2' }),
    patientId = '3830';

  client.read({
    id: 'Patient/' + patientId
  }).then(function(p) {
      var name = p.content.name[0];
      var formatted = name.given.join(" ") + " " + name.family;
      $("#patient_name").text(formatted);
    });

  client.search({
    type: 'MedicationPrescription',
      graph: false, // tie in the included resources by following references
                   // automatically to form an in-memory graph -- so we don't 
                   // have to resolve references one by one.
    query: {
      patient: {
        $type: 'Patient',
        _id: patientId
      },
      $include: {
        MedicationPrescription: ['medication']
      }
    }}).then(function(prescriptions) {
      
      prescriptions.entry.forEach(function(medicationEntry) {
        var name = medicationEntry.resource.medication.display;
        $("#med_list").append("<li>"+ name + "</li>");
      });
  
  });

for (var i = 1; i <= 31; i++) {
  $(".birth-day").append("<option value=\"" + i + "\">" + i + "</option>");
}

for (var i = 1950; i <= 1990; i++) {
  $(".birth-year").append("<option value=\"" + i + "\">" + i + "</option>");
}

$("#patient-submit").submit(function(event) {
  
  // Prevents page reload.
  event.preventDefault();

  // Grab all inputs.
  var firstName = $("#first-name").val();
  var lastName = $("#last-name").val();

  var gender = $(".gender").val();

  var birthYear = $(".birth-year").val();
  var birthMonth = $(".birth-month").val();
  var birthDay = $(".birth-day").val();

  var birthDate = birthYear + "-" + birthMonth + "-" + birthDay;


  var entry = {
    entry: {
      category: [],
      content: {
        "resourceType": "Patient",
        "text": {
          "name": [
            {
              "family": [
                lastName
              ],
              "given": [
                firstName
              ]
            }
          ],
          "gender": gender,
          "birthDate": birthDate
        },
        "search": {
          "mode": "match"
        }
      }
    }
  };
  
  client.create(entry).then(function(data) {
    console.log("Successfully added");
  })
  

});
