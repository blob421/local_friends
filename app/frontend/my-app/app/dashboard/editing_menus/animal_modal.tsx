'use-client'
import {useState} from 'react'
import AsyncSelect from "react-select/async";
import handle_debounce from "../../utilities/debounce";
import $ from 'jquery'
type animal_modal_props = {
    url?: string, onClose: () => void
}
type Option = { value: string; label: string };


export default function AnimalModal({url, onClose}: animal_modal_props){
    const search_url = `${url}/graphql`
    
    const loadOptions = handle_debounce(search_url, 'animals')
    const [selectedOption, setSelectedOption] = useState<Option | null>(null);
    return(
         <div id="profile_modal_bg" className='row p-0 m-0 d-flex justify-content-center 
         align-items-center'>
            <div className="mini_modal g-0 col-11 col-md-4 d-flex flex-column 
            p-4 pt-md-4 mb-5 mb-md-0 p-md-3 mt-3 mt-md-0 justify-content-end">
                  <button className="x_btn_reg txt_md"
                   onClick={()=> onClose()
                   }>X</button>

                <form action={`${url}/profile/edit`} method='POST' 
                className='d-flex h-100 flex-column align-items-end 
                w-100 pl-4 pr-4'>

                <div className='row p-0 m-0 d-flex align-items-end justify-content-end 
                h-50 flex-shrink-0 w-100'>

                  
                     <AsyncSelect
                     cacheOptions
                     placeholder={'Search an animal ...'}
                     className="animal_select txt_md w-100 p-0 m-0"
                     onChange={(option)=> setSelectedOption(option) }
                     defaultOptions={[{label: 'cat', value:'1'}, {label:'fox', value:'2'}]}
                     loadOptions={loadOptions}/>

               </div>

               <div className='row p-0 m-0 d-flex align-items-end h-50 flex-shrink-0 w-100 
                                     justify-content-end'>
                  <button type='submit' name='animal_select'
                           className='submit_btn_edit_profile txt_md' 
                           value={selectedOption?.label || "" }>Update</button>
              </div>
         
               </form>  

            </div>
         </div>
    )
}

