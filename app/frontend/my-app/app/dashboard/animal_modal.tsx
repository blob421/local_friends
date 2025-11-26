'use-client'
import {useState} from 'react'
import AsyncSelect from "react-select/async";
import handle_debounce from "../components/debounce";
import $ from 'jquery'
type animal_modal_props = {
    url?: string
}
type Option = { value: string; label: string };

export default function AnimalModal({url}: animal_modal_props){
    const search_url = `${url}/animals`
    
    const loadOptions = handle_debounce(search_url)
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    return(
         <div id="profile_modal_bg_animal">
            <div className="profile_modal mini_modal">
                  <button className="x_btn_modal_edit_dash"
                   onClick={()=> $('#profile_modal_bg_animal').hide()}>X</button>
                <form action={`${url}/profile/edit`} method='POST'>

                  <AsyncSelect
                  cacheOptions
                  placeholder={'Search an animal'}
                  className="region_select animal_select"
                  onChange={(option)=> setSelectedOption(option) }
                  defaultOptions={[{label: 'cat', value:'1'}, {label:'fox', value:'2'}]}
                  loadOptions={loadOptions}/>
                  <button type='submit' name='animal_select'
                  className='submit_btn_edit_animal' value={selectedOption?.label || "" }>Update</button>
               </form>  
            </div>
         </div>
    )
}

