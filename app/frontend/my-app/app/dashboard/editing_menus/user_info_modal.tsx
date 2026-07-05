
import { useState } from "react";
import $ from 'jquery'
import AsyncSelect from 'react-select/async';
import handle_debounce from "../../utilities/debounce";

type UserInfoModalProps = {
  url?: string;        // might be undefined
  username?: string;
  firstName?: string
  lastName?: string
  email?: string;
  pictureUrl?: string;
  Region?: string;
  RegionId?: Number;
  onClose: () => void
  
};



type Option = { value: string; label: string };

export default function User_info_modal({url, username, email, firstName, lastName,
    pictureUrl, Region, RegionId ,onClose}: UserInfoModalProps){
    const [newPassword, setNewPass] = useState("");
    const [passConf, setPassConf] = useState("");
    const [options, setOptions] = useState([]);
    const [selectedOption, setSelectedOption] = useState<Option | null>();
    const params = new URLSearchParams(window.location.search)
    const usernameExists = params.get('username')
    
    const search_url = `${url}/graphql`
    const loadOptions = handle_debounce(search_url, 'addresses')

  return(
    
    <div id="profile_modal_bg" className="row position-absolute p-0 m-0 d-flex 
    justify-content-center align-items-md-center align-items-start pb-4">
  
     <div className="profile_modal col-12 col-md-6 g-0 d-flex flex-column top-0 top-md-50" id="profile_modal">

        <button className="x_btn_reg txt_md"
        onClick={()=> onClose()}>X</button>

         <form className="image_form p-0 m-0" encType="multipart/form-data" 
                               action={`${url}/profile/edit`} method="POST">

            <div className="top_picture_flex gap-2 gap-sm-5 gap-md-4 pb-3 pb-sm-4 pt-sm-4 pt-3 p-md-2 pl-4 ">
               <div className="dash_picture_cont">
                    {pictureUrl && <img src={url + pictureUrl} className="pic_edit"></img>}
            
                    {!pictureUrl && <img src={'/avatar.png'} className="pic_edit"
                    alt="profile picture">
                    </img>}
              
                    <label htmlFor="avatarUpload" className="custom_upload">
                    <img src="/pen.png" alt="Upload avatar" className="pen_picture"/>
                    </label>
             </div>
                <div id="region_dropdown">
                      <div className="region_bar_head">{Region}</div> 
                        
                      <AsyncSelect
                          cacheOptions
                          loadOptions={loadOptions}
                          defaultOptions
                          className="region_select txt_sm"
                          value={selectedOption}              
                          onChange={(option) => {setSelectedOption(option);
                          
                          }} 
                          placeholder={"Select a region"}
                        />
                </div>
            </div>
           

            <input
            id="avatarUpload"
            type="file"
            accept="image/*"
            name="image"
            style={{ display: "none" }}
            onChange={(e) => e.target.form?.submit()}
            />
         </form>
        
         <form action={`${url}/profile/edit`} method="POST" 
          encType="multipart/form-data" className="row form_profile_user w-100 
          d-flex justify-content-center txt_md p-3 p-md-0 m-0 pb-md-2 pt-5 pt-md-4 gap-4 gap-md-4">

             <input type="hidden" name="region" id="region_input"
             value={selectedOption?.value || ''}></input>

              <div className="col-11 col-sm-10 col-md-5 gap-4 gap-md-3 d-flex flex-column 
              align-items-center">

                
                  <div className="flex-shrink-0 w-100">
                      <div>First name</div>
                        
                        <input type="text" name="firstName" placeholder={firstName}/>
                      
                  </div>
                   <div className="flex-shrink-0 w-100">
                        <div>Last name</div>
                        <input type="text" name="lastName" placeholder={lastName}>
                        </input>
                  </div>
                  <div className="flex-shrink-0 w-100">
                        <div>Username</div>
                        <input type="text" name="username" placeholder={username} autoComplete="new-username">
                        </input>
                        
                  </div>

                   {usernameExists && <div className="error_username_dash flex-shrink-0">
                        Username unavailable</div>}
           

                </div>
    
        <div className="col-11 col-sm-10 col-md-5 gap-4 gap-md-3 d-flex flex-column 
              align-items-center">

                <div className="flex-shrink-0 w-100">
                     <div>Email</div>
                    <input type="text" name="email" placeholder={email} autoComplete="new-email">
                    </input>
              </div>

                <div className="flex-shrink-0 w-100">

                     <div>Password</div>
                    <input type="password" name="password" autoComplete="new-password"
                    onChange={(e)=>setNewPass(e.target.value)}
                    placeholder="New password"></input>
              </div>

              <div className="flex-shrink-0 w-100">

                  <div>Confirm password</div>
                  <input type="password" name="password_2"
                    onChange={(e)=> setPassConf(e.target.value)}
                    placeholder="Confirm" autoComplete="new-password"></input>
             </div>
          
           
         

              {passConf !== newPassword &&  
            
                    <div className="error_passwords_profile flex-shrink-0">
                        Passwords don't match
                    </div>
            
             
             }
                   <div className="row submit_cont_dash_edit w-100 justify-content-end justify-content-md-end">
              <input type="submit" className="submit_btn_edit_profile txt_md" 
              disabled={passConf !== newPassword} value={'Update'}>
              </input>
           </div>

           </div>
        
    
              
        
       
         </form>
     </div>
</div>

  )
}