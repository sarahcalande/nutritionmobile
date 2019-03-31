import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { WebBrowser } from 'expo';
const nutrientsURL = 'http://localhost:3000/nutrients';

import { MonoText } from '../components/StyledText';

export default class HomeScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };




    function fetchNutrients() {
      return fetch(nutrientsURL)
        .then(r => r.json())
        .then(r => r.forEach(nutrient => renderNutrients(nutrient)))
        .then(descriptionEvents)
    }

    function renderNutrients(nutrient){
let nutritiontable = document.querySelector('#nutrition-table')
nutritiontable.innerHTML +=
`<tr id=${nutrient.id}>
    <td id="vitamin" data-name = "${nutrient.name}" data-description="${nutrient.description}" data-suggestion="${nutrient.suggestion}">${nutrient.name}</td>
    <td>${nutrient.value} ${nutrient.unit}</td>
    <td>0</td>
    <td class="percentage" data-name = "${nutrient.name}" data-description="${nutrient.description}" data-suggestion="${nutrient.suggestion}"><span id = "${nutrient.name}1" style='background-color:#F88;display:block;width:0%'>0</span></td>
        <td data-id="${nutrient.id}" data-description=${nutrient.description}></td>
  </tr>`
}

function fetchIngredients() {
  return fetch(ingredientsURL)
    .then(r => r.json())
    .then(r => r.forEach(ingredient => renderIngredients(ingredient)))
}

function renderIngredients(ingredient) {
    let tr = document.createElement('tr');
    tr.dataset.id = ingredient.id;
    tr.innerHTML = `<td>${ingredient.name}</td><td>${ingredient.measure}</td><td><input type="number" min=1 max=100></td><td><button>Add</button></td>`;
    myTable.append(tr);
  };


  //SEARCH!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    mySearch.addEventListener('keyup', () => {
      let filter, table, tr, td, i;
      // input = document.getElementById("mySearch");
      filter = mySearch.value.toUpperCase();
      table = document.getElementById("myTable");
      tr = table.getElementsByTagName("tr");
      for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[0];
        if (td) {
          if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
      }
    })


    //ADDING TO NUTRITIONAL PROFILE

      document.querySelector('#myTable').addEventListener('click', () => {
        if (event.target.nodeName === 'BUTTON') {
          let li = document.createElement('li')
          let id = event.target.parentElement.parentElement.dataset.id
          li.dataset.id = id
          let item = event.target.parentElement.parentElement.children[0].innerText;
          let quantity = event.target.parentElement.parentElement.children[2].children[0].value;
          String.prototype.isNumber = function(){return /^\d+$/.test(this);}
          if (quantity.isNumber()) {
            li.innerHTML = `<span>${item} --</span> <span class="quantity">${quantity}</span> servings <button>Delete</button>`
            consumedItems.append(li)
            consumedItems.style.backgroundColor = "white"
            event.target.parentElement.parentElement.children[2].children[0].value = '';
            addNutritionalProfile(id, quantity)
          }
        }
      });
      var myChart;

        function addNutritionalProfile(id, quantity) {
          fetch(`${ingredientsURL}/${id}`)
            .then(r => r.json())
            .then(r => {
              r['ingredient_nutrients'].forEach(nutrient => {
                let value = parseFloat(nutrient.value)
                let tableRow = document.getElementById(`${nutrient.nutrient_id}`)
                tableRow.children[2].innerText = Math.round((parseFloat(tableRow.children[2].innerText) + value * quantity) * 1000) / 1000;
                let currentValue = parseFloat(tableRow.children[2].innerText);
                let allowedValue = parseFloat(tableRow.children[1].innerText);
                let percentage = Math.round((currentValue * 100) / allowedValue)
                tableRow.children[3].children[0].innerText = percentage;
                if (percentage >= 0 && percentage <= 100) {
                  tableRow.children[3].children[0].style.width = `${percentage}%`;
                } else {
                  tableRow.children[3].children[0].style.width = '100%'
                }
                if (percentage >= 50) {
                  tableRow.children[3].children[0].style['background']='linear-gradient(to bottom, rgba(200,254,188,1) 0%,rgba(164,254,144,1) 45%,rgba(123,255,93,1) 100%)';
                    tableRow.children[3].children[0].style['border-radius']= '15px'
                  let span = document.createElement('span')
                  // let divImage = document.createElement('div')
                  // divImage.backgroundColor = "black"
                  // let num = Math.floor(Math.random() * 6)
                  // span.innerHTML = `<img id='vitamin' src = "${num}.gif" >`
                  // tdimage.appendChild(divImage)
                  tableRow.appendChild(span)
                } else if (percentage >= 25 && percentage <= 49) {
                  tableRow.children[3].children[0].style['background']='linear-gradient(to bottom, rgba(254,233,188,1) 0%,rgba(254,219,144,1) 45%,rgba(255,204,93,1) 100%)';
                    tableRow.children[3].children[0].style['border-radius']= '15px'
                } else {
                  tableRow.children[3].children[0].style['background']='linear-gradient(to bottom, rgba(254,187,187,1) 0%,rgba(254,144,144,1) 45%,rgba(255,92,92,1) 100%)';
                  tableRow.children[3].children[0].style['border-radius']= '15px'
                }


                ////////////////////////////////////////////////////////////////////
                //DONUT CHART

                          let protein = document.querySelector("#Protein1").innerText
                          let fat = document.getElementById('Total lipid (fat)1').innerText
                          let carbs = document.getElementById('Carbohydrate1').innerText
                          canvas = document.getElementById("doughnut-chart")
                          // canvas.parentElement.replaceChild('<canvas id="doughnut-chart" width="230" height="230" style="display: block; width: 230px; height: 230px;">', canvas)
                          // var newcanvas = document.getElementById('doughnut-chart')
                          // let nutprof = document.getElementById("nutrtional-profile")
                          // nutprof.children[0]
                          // console.log(canvas)
                          canvas.className = "unhide-chart chartjs-render-monitor"

                          if (myChart) {
         myChart.destroy();
       }

                              myChart = new Chart(canvas, {
                                type: 'doughnut',
                                data: {
                                  labels: ["Fat", "Carbohydrates", "Protein"],
                                  datasets: [
                                    {
                                      label: "Macronutrients",
                                      backgroundColor: ["salmon", "lightblue","lightgreen"],
                                      data: [fat, carbs, protein]
                                    }
                                  ]
                                },
                                DatasetController: {
                                    update: function(reset) {},
                                },
                                options: {
                                  title: {
                                    display: true,
                                    text: 'Macronutrients'
                                  }

                                },

                                  })



      //myChart.config.data.datasets[0].data is the array of numbers


                                          // canvas.data.datasets[0].data
                                  ;


                /////////////////////////////////////////////////////////////////////////

                    })
                      })
        }



        //DELETING THINGS IN NUTRITIONAL PROFILE
          consumedItems.addEventListener('click', () => {
            if (event.target.nodeName === 'BUTTON') {
              let id = event.target.parentElement.dataset.id;
              let quantity = event.target.previousSibling.previousSibling.innerText
              event.target.parentElement.remove();


              removeNutritionalProfile(id, quantity)
            }
          })



            function removeNutritionalProfile(id, quantity) {
              fetch(`${ingredientsURL}/${id}`)
                .then(r => r.json())
                .then(r => {
                  r['ingredient_nutrients'].forEach(nutrient => {
                    let name = nutrient.nutrients
                    let value = parseFloat(nutrient.value)
                    let tableRow = document.getElementById(`${nutrient.nutrient_id}`)
                    tableRow.children[2].innerText = Math.round((parseFloat(tableRow.children[2].innerText) - value * quantity) * 1000) / 1000
                    let currentValue = parseFloat(tableRow.children[2].innerText);
                    let allowedValue = parseFloat(tableRow.children[1].innerText);
                    let percentage = Math.round((currentValue * 100) / allowedValue)
                    tableRow.children[3].children[0].innerText = percentage
                    if (percentage >= 0 && percentage <= 100) {
                      tableRow.children[3].children[0].style.width = `${percentage}%`;
                    } else {
                      tableRow.children[3].children[0].style.width = '100%'
                    }
                    if (percentage >= 50) {
                      tableRow.children[3].children[0].style['background-color']='lime'
                    } else if (percentage >= 25 && percentage <= 49) {
                      tableRow.children[3].children[0].style['background-color']='orange'
                    } else {
                      tableRow.children[3].children[0].style['background-color']='red'
                    }
                    let protein = document.querySelector("#Protein1").innerText
                    let fat = document.getElementById('Total lipid (fat)1').innerText
                    let carbs = document.getElementById('Carbohydrate1').innerText

                    canvas = document.getElementById("doughnut-chart")
                    // canvas.parentElement.replaceChild('<canvas id="doughnut-chart" width="230" height="230" style="display: block; width: 230px; height: 230px;">', canvas)
                    // var newcanvas = document.getElementById('doughnut-chart')
                    // let nutprof = document.getElementById("nutrtional-profile")
                    // nutprof.children[0]
                    // console.log(canvas)

                              if (myChart) {
                                myChart.destroy();
                    }

                                  myChart = new Chart(canvas, {
                                    type: 'doughnut',
                                    data: {
                                      labels: ["Fat", "Carbohydrates", "Protein"],
                                      datasets: [
                                        {
                                          label: "Macronutrients",
                                          backgroundColor: ["salmon", "lightblue","lightgreen"],
                                          data: [fat, carbs, protein]
                                        }
                                      ]
                                    },
                                    DatasetController: {
                                        update: function(reset) {},
                                    },
                                    options: {
                                      title: {
                                        display: true,
                                        text: 'Macronutrients'
                                      }

                                    },

                                  })
                                  if (fat == 0 && carbs == 0 && protein == 0){
                                    canvas.style.display = 'none'
                                  }
                                    })

                          })

                      }

                    })


  //SHOWING INFO ABOUT EACH NUTRIENT


function descriptionEvents(){

//SUGGESTIONS PROMPT
    let percent = document.querySelectorAll('.percentage')
        let inner = document.querySelector('#suggestioninner')
    percent.forEach(nutrient => nutrient.addEventListener('click', junk))
    function junk(e){
      console.log(inner)
    let header = document.querySelector('#secondheader')
    header.innerText = e.target.parentElement.dataset.name
    console.log(e.target.innerText)
        if (parseInt(e.target.innerText) < 75 && parseInt(e.target.innerText) > 50){
          inner.innerText = `Not bad, but not enough ${e.target.parentElement.dataset.name}`
        }
        else if (parseInt(e.target.innerText) >= 50 && parseInt(e.target.innerText)) {
          inner.innerText = `You're getting a good amount of ${e.target.parentElement.dataset.name}!
           Here are the benefits: ${e.target.parentElement.dataset.description}`
         } else if (parseInt(e.target.innerText) <= 50) {
              inner.innerText = `This is not enough ${e.target.parentElement.dataset.name}. Try ${e.target.parentElement.dataset.suggestion}.`
          }
        $('#suggestion')
          .modal('show')
        ;
}

    //make suggestions for food w/ highest content based on what was clicked




//CUSTOM FOOD PROMPT FORM
let addcustom = document.querySelector('#lookingfor')
addcustom.addEventListener('click', promptCustom)
function promptCustom(e){


  $('#promptmodal')
    .modal('show')
  ;



  //make a form and post the info to the back end and give option to save to table
      }

let modaldiv = document.querySelector('#promptmodal')
modaldiv.addEventListener('submit', submitfunction)

function submitfunction(e){
      e.preventDefault()


    let data =
    {
      name:   e.target.name.value,
      measure: e.target.measure.value,
      nutrients: [
          {
              "nutrient_id": "291",
              "nutrient": "Fiber, total dietary",
              "unit": "g",
              "value": e.target.nutrients[0].value,
              "gm": 0.0
          },
          {
              "nutrient_id": "430",
              "nutrient": "Vitamin K (phylloquinone)",
              "unit": "\u00b5g",
              "value": e.target.nutrients[1].value,
              "gm": "--"
          },
          {
              "nutrient_id": "301",
              "nutrient": "Calcium, Ca",
              "unit": "mg",
              "value": e.target.nutrients[2].value,
              "gm": 3.0
          },
          {
              "nutrient_id": "323",
              "nutrient": "Vitamin E (alpha-tocopherol)",
              "unit": "mg",
              "value": e.target.nutrients[3].value,
              "gm": "--"
          },
          {
              "nutrient_id": "203",
              "nutrient": "Protein",
              "unit": "g",
              "value": e.target.nutrients[4].value,
              "gm": 0.25
          },
          {
              "nutrient_id": "401",
              "nutrient": "Vitamin C, total ascorbic acid",
              "unit": "mg",
              "value": e.target.nutrients[5].value,
              "gm": "--"
          },
          {
              "nutrient_id": "324",
              "nutrient": "Vitamin D",
              "unit": "IU",
              "value": e.target.nutrients[6].value,
              "gm": "--"
          },
          {
              "nutrient_id": "204",
              "nutrient": "Total lipid (fat)",
              "unit": "g",
              "value": e.target.nutrients[7].value,
              "gm": "--"
          },
          {
              "nutrient_id": "303",
              "nutrient": "Iron, Fe",
              "unit": "mg",
              "value": e.target.nutrients[8].value,
              "gm": "--"
          },
          {
              "nutrient_id": "205",
              "nutrient": "Carbohydrate, by difference",
              "unit": "g",
              "value": e.target.nutrients[9].value,
              "gm": 1.3
          },
          {
              "nutrient_id": "304",
              "nutrient": "Magnesium, Mg",
              "unit": "mg",
              "value": e.target.nutrients[10].value,
              "gm": 7.0
          },
          {
              "nutrient_id": "315",
              "nutrient": "Manganese, Mn",
              "unit": "mg",
              "value": e.target.nutrients[11].value,
              "gm": 0.006
          },
          {
              "nutrient_id": "306",
              "nutrient": "Potassium, K",
              "unit": "mg",
              "value": e.target.nutrients[12].value,
              "gm": 26.0
          },
          {
              "nutrient_id": "317",
              "nutrient": "Selenium, Se",
              "unit": "\u00b5g",
              "value": e.target.nutrients[13].value,
              "gm": "--"
          },
          {
              "nutrient_id": "318",
              "nutrient": "Vitamin A, IU",
              "unit": "IU",
              "value": e.target.nutrients[14].value,
              "gm": "--"
          },
          {
              "nutrient_id": "417",
              "nutrient": "Folate, total",
              "unit": "\u00b5g",
              "value": e.target.nutrients[15].value,
              "gm": "--"
          },
          {
              "nutrient_id": "307",
              "nutrient": "Sodium, Na",
              "unit": "mg",
              "value": e.target.nutrients[16].value,
              "gm": "--"
          },
          {
              "nutrient_id": "208",
              "nutrient": "Energy",
              "unit": "kcal",
              "value": e.target.nutrients[17].value,
              "gm": 29.0
          },
          {
              "nutrient_id": "418",
              "nutrient": "Vitamin B-12",
              "unit": "\u00b5g",
              "value": e.target.nutrients[18].value,
              "gm": "--"
          },
          {
              "nutrient_id": "309",
              "nutrient": "Zinc, Zn",
              "unit": "mg",
              "value": e.target.nutrients[19].value,
              "gm": "--"
          }
      ]
    }


    fetch('http://localhost:3000/ingredients', {
      method: "POST",
      headers:  {
    'Content-Type': 'application/json; charset=utf-8'
  },
      body: JSON.stringify(data)
    }).then(r=>r.json())
.then((ingredient) => {
  let tr = document.createElement('tr');
      tr.dataset.id = ingredient.id;
      tr.innerHTML = `<td>${ingredient.name}</td>
      <td>${ingredient.measure}</td>
      <td><input type="number" min=1 max=100></td>
      <td><button>Add</button></td>`;
      myTable.append(tr);}
    )


}


let clicknutrient = document.querySelectorAll('#vitamin')
clicknutrient.forEach(nutrient => nutrient.addEventListener('click', funk))
function funk(e){
  let header = document.querySelector('#firstheader')
  let descriptionpart = document.querySelector('.description')
    header.innerText = e.target.dataset.name
    console.log(e.target.descriptionpart);
  descriptionpart.innerText = e.target.dataset.description

$('#descriptionmodal')
.modal('show')
;

}



}







  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
          <View style={styles.welcomeContainer}>
            <Image
              source={
                __DEV__
                  ? require('../assets/images/robot-dev.png')
                  : require('../assets/images/robot-prod.png')
              }
              style={styles.welcomeImage}
            />
          </View>

          <View style={styles.getStartedContainer}>
            {this._maybeRenderDevelopmentModeWarning()}

            <Text style={styles.getStartedText}>Get started by opening</Text>

            <View style={[styles.codeHighlightContainer, styles.homeScreenFilename]}>
              <MonoText style={styles.codeHighlightText}>screens/HomeScreen.js</MonoText>
            </View>

            <Text style={styles.getStartedText}>
              Change this text and your app will automatically reload.
            </Text>
          </View>

          <View style={styles.helpContainer}>
            <TouchableOpacity onPress={this._handleHelpPress} style={styles.helpLink}>
              <Text style={styles.helpLinkText}>Help, it didn’t automatically reload!</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <View style={styles.tabBarInfoContainer}>
          <Text style={styles.tabBarInfoText}>This is a tab bar. You can edit it in:</Text>

          <View style={[styles.codeHighlightContainer, styles.navigationFilename]}>
            <MonoText style={styles.codeHighlightText}>navigation/MainTabNavigator.js</MonoText>
          </View>
        </View>
      </View>
    );
  }

  _maybeRenderDevelopmentModeWarning() {
    if (__DEV__) {
      const learnMoreButton = (
        <Text onPress={this._handleLearnMorePress} style={styles.helpLinkText}>
          Learn more
        </Text>
      );

      return (
        <Text style={styles.developmentModeText}>
          Development mode is enabled, your app will be slower but you can use useful development
          tools. {learnMoreButton}
        </Text>
      );
    } else {
      return (
        <Text style={styles.developmentModeText}>
          You are not in development mode, your app will run at full speed.
        </Text>
      );
    }
  }

  _handleLearnMorePress = () => {
    WebBrowser.openBrowserAsync('https://docs.expo.io/versions/latest/guides/development-mode');
  };

  _handleHelpPress = () => {
    WebBrowser.openBrowserAsync(
      'https://docs.expo.io/versions/latest/guides/up-and-running.html#can-t-see-your-changes'
    );
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
  },
  welcomeContainer: {
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  getStartedContainer: {
    alignItems: 'center',
    marginHorizontal: 50,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
