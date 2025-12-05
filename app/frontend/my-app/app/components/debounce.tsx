import debounce from 'lodash.debounce'
import {fetchAuth} from '../components/fetch'

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
  const full_url = url + `?name=${input}`
    fetchAuth(full_url).then(res => res.json()).then(data=> {
      console.log(data)
         if (type == 'streets'){
        choices = data.results.map((element:element) => ({
            label: element.number + ' ' + element.street + ', ' + (element.city? element.city: ""),
            value:  element.number + element.street,
            coords: {longitude: element.longitude, latitude: element.latitude}
            
        }))}else{
             choices = data.results.map((element:element) => ({
            label: element.name,
            value: element.id
            
        }))
        }
        callback(choices)
    })
    
      
  }, 400)
}