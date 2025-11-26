import debounce from 'lodash.debounce'
import {fetchAuth} from '../components/fetch'

type element = {
    name: string
    id: string
}
export default function handle_debounce(url:string){

  return debounce((input, callback)=>{
    if (input.length < 2){
        callback([])
        return
    }
  const full_url = url + `?name=${input}`
    fetchAuth(full_url).then(res => res.json()).then(data=> {
        const choices = data.results.map((element:element) => ({
            label: element.name,
            name: element.name
            
        }))
        callback(choices)
    })
    
      
  }, 400)
}