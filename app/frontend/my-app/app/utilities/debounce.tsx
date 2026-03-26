import debounce from 'lodash.debounce'
import {fetchAuth} from './fetch'
///////////////////////// GRAPHQL ///////////
const GET_ANIMALS = `
  query ($name: String!) {
    animals(name: $name){
    id
    name
    }
  }
`;

const GET_REGION = `
  query ($name: String!) {
    regions(name: $name){
    id
    name
    }
  }
`;

const GET_STREET = `
  query ($name: String!) {
    addresses(name: $name){
    number
    street
    city 
    longitude
    latitude
    }
  }
`;
//////////////////////////////////////////////////////////
type element = {
    name: string
    id: string
    number: string
    street?: string
    city?:string
    district?:string
    longitude?:Number
    latitude?: Number
}

export default function handle_debounce(url:string, type:string){

  let choices:element[]

  return debounce((input, callback)=>{
    if (input.length < 2){
        callback([])
        return
    }
 

        fetchAuth(url, {
                method: "POST",
                body: 
                      type == 'addresses' ? JSON.stringify({query: GET_STREET, variables: {name: input}})
                    : type == 'animals' ? JSON.stringify({query: GET_ANIMALS, variables: {name: input}})
                    : JSON.stringify({query: GET_REGION, variables: {name: input}})

                
        }).then(res => res.json()).then(data => {
                console.log(data)
                choices =  type !== 'addresses' ? data.data[type].map((element:element) => ({
                label: element.name,
                value: element.id
              }))
                                            :  data.data[type].map((element:element) => ({
                label: element.number + ' ' + element.street + ', ' + (element.city? element.city: ""),
                value:  element.number + element.street,
                coords: {longitude: element.longitude, latitude: element.latitude}

                
              }))

            callback(choices)
        })


   
    
  
    
      
  }, 400)
}


