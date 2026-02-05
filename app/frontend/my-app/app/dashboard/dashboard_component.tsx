"use client";
import { useEffect, useState } from "react"
import { fetchAuth } from '../utilities/fetch';
import Image from 'next/image'
import $ from 'jquery'
import dynamic from 'next/dynamic';
import { decodeUrlSafe } from "../utilities/encode";

import type {Region, User, Badge, UserBadge, stats} from '../types_dashboard'
import {baseUser} from '../types_dashboard'

const PostsComponent = dynamic(()=> import('./tabs/posts_component'))
const SummaryComponent = dynamic(()=> import('./tabs/summary_component'))
const FirstLoginModal = dynamic(()=> import('./first_login_modal'))
const FollowersModal = dynamic(()=> import('./tabs/followers_modal'))
const UserModal = dynamic(()=> import('./editing_menus/user_info_modal'))
const AnimalModal = dynamic(() => import('./editing_menus/animal_modal'))
const Settings = dynamic(()=> import('./tabs/options_modal'))


type DashboardProps = {visitor: boolean}

type Settings= {showEmail : boolean 
  postScopeRegion: boolean
    firstLogin: boolean
}



export type following = User[]


export default function DashboardMain({visitor}: DashboardProps){
  
     const url = process.env.NEXT_PUBLIC_API_URL

     const [user, setUser] = useState<User>(baseUser)
     const [Usersettings, setUserSettings] = useState<Settings>({ 
      showEmail: false, postScopeRegion: false, firstLogin:false });

     const [region , setRegion] = useState<Region | null >(null)
 

     const [badges, setBadges] = useState<Badge[]>([])
     const [userBadge, setUserBadge]= useState<UserBadge[]>([])
     const [obtainedBadges, setObtainedBadges] = useState<number[]>([])
    
     const [summary, summaryToggled] = useState(true)
     const [postPage, postsToggled] = useState(false)
     const [showModal, setModal] = useState(false)
     const [modalTriggered, setModalTriggered] = useState(false)
     const [animalModal, setAnimalModal] = useState(false)
     const [optionsModal, setOptionsModal] = useState(false)
     const [following, setFollowing] = useState(true)
     const [userStats, setStats] = useState<stats | undefined>(undefined)
     const [followClicked, setFollowClicked] = useState(false)
     const [followClicked2, setFollowClicked2] = useState(false)
     const [reqUser, setReqUser] = useState("")
     const [followerModal, setFollowerModal] = useState(false)
    // const [following_users, setFollowingUsers] = useState<following>([])

     const [activeHint, setHint] = useState("")

     const unfollow = async () =>{
        const unfollow_url = `${url}/unfollow/user/${user?.id}`
        await fetchAuth(unfollow_url, {method: 'POST'}).then(res=> res.status == 200 ? location.reload() : 
      alert('There was a problem unfollowing , try again later'))
     }

     useEffect(()=>{
       const fetch_data = async () =>{
       const params = new URLSearchParams(window.location.search)

       if (params.get('post')){
        postsToggled(true)
        summaryToggled(false)
        
        
       }

       const modal = params.get('modal')
       
       let fetch_url

       if(modal){
       setModal(true)
       $('#profile_modal_bg').show()
       }
      if (visitor) {
        const id = params.get('id')
        const decodedId = id ? decodeUrlSafe(id) : null;
        fetch_url = `${url}/profile/${decodedId}`
      }else {
        fetch_url = `${url}/dashboard`
      }
       try {
         
        const response = await fetchAuth(fetch_url, {
           method: 'GET',
           
           headers : {'Content-Type': 'application/json'}
          })
          const data = await response.json()
          console.log(data)
          setUser(data.user)
 
          setStats(data.stats)


          if(data.badges){
             setBadges(data.badges)
          }
   
          if (data.UserBadges && data.UserBadges.length > 0){
            setUserBadge(data.UserBadges)
          }
          setReqUser(data.req_user)
          console.log(data.user)
  
          setUserSettings(data.settings)
          if( !data.user.Region){
        
             $('.home_link').hide()
            $('.map_link').hide()
          }
          
          

      //    setFollowingUsers(data.following_Users)
     
          setFollowing(data.following)

   
           }catch(error){
               console.log(error)
           }
       };
     
      fetch_data();
      
     }, []);

useEffect(()=> {
  const expand_pop_up = () => {
       console.log(following)
      
        if (!following){
        const popup = $('#follow_popup')
        popup.addClass('popup_expanded')
        }

       }

  expand_pop_up()
}, [following])

useEffect(()=>{
 
   const badgeIds= badges.map(b=> b.id)
   const UserBadgeIds = userBadge.map(b=>b.BadgeId)
   const obtained = badgeIds.filter(b=> UserBadgeIds.includes(b))
   setObtainedBadges(obtained)
    
}, [badges, userBadge])

const follow = async () => {
    const follow_url = `${url}/follow/${user?.id}`
    await fetchAuth(follow_url, {method: 'POST'}).then(res=>{ 
      if (res.status == 400){
         alert('Oops , something went wrong with your request')
      }
    })
   }
   
   console.log("reqUser:", reqUser, "id:", user?.id, "following:", following);

     return (
      <div className="dash_cont container-fluid" id="dash_cont">
        {visitor && <div id="follow_popup" className={followClicked2 ? "shrink": ""} >
                          <div id="follow_href" className={followClicked? "fadeout": ""} onClick={()=>{
                             
                              setFollowClicked(true)
                       
                        
                          }}><div onClick={()=> {setTimeout(()=> setFollowClicked2(true), 1500);
                             follow();
                           }}>Follow</div>
                          </div>
                          <div id="checkmark_follow" className={followClicked? "appear" : ""}>
                            Followed <img src={'/checkmark.png'} className="green_checkmark_follow"/>
                          </div>
                   </div>
          }
        <div className="row outer_row_dash">
           <div className="col-lg-1 d-flex flex-row flex-lg-column gap-4 gap-lg-4 pl-4 pl-lg-0
               mt-0 
               align-items-center pt-3 pb-1 pt-lg-5 pb-lg-0 menu_options justify-content-lg-start justify-content-center"
               >
              {!visitor && <div className="dash_img_menu_cont">
                                  <img src="/avatar.png" alt="stats_icon" 
                                  className={summary ?"selected_tab_dash dash_tab_icon" :"dash_tab_icon"}
                                   onClick={()=> summaryToggled(true)}/>
                                  <div className={"hint_div_dash"}>Summary</div>
                          </div>
              }
              {!visitor && <div className="dash_img_menu_cont">
                                  <img src="/feed_icon2.png" alt="stats_icon" 
                                  className={postPage ?"selected_tab_dash dash_tab_icon" :"dash_tab_icon"}
                                   onClick={()=> {postsToggled(true); summaryToggled(false)}}/>
                                  <div className={"hint_div_dash"}>Posts</div>
                          </div>
              }

        
              {!visitor && <div className="dash_img_menu_cont">
                                  <img src="/group_icon.png" alt="stats_icon" 
                                  className={followerModal ?"selected_tab_dash dash_tab_icon" :"dash_tab_icon"}
                                   onClick={()=> {setFollowerModal(true);}}/>
                                  <div className={"hint_div_dash"}>Followers</div>
                          </div>
              }
              
              {!visitor && <div className="dash_img_menu_cont">
                                <Image src="/gear_icon.png" alt="gear_icon" 
                                className={optionsModal ? 'selected_tab_dash dash_tab_icon': "dash_tab_icon"}
                                width={30} height={30} onClick={()=> {setOptionsModal(true);}}/>
                                <div className={"hint_div_dash"}>Settings</div>
                          </div>
              }

            </div>


            {summary &&
            
             <SummaryComponent user={user} visitor={visitor} reqUser={reqUser}
             following={following} setModalTriggered={(bool:boolean)=> setModalTriggered(bool)}
             userStats={userStats} setAnimalModal={(bool:boolean) => setAnimalModal(bool)}
             badges={badges} obtainedBadges={obtainedBadges} 
             
             unfollow={() => unfollow()}/>
           
             }

            {postPage && 
             <PostsComponent userId={user.id}/>
             }

     </div>

{Usersettings.firstLogin && <FirstLoginModal/>}
{followerModal && <FollowersModal closeModal={()=> setFollowerModal(false) }/>}
{animalModal && <AnimalModal url={url}/>}

{optionsModal && <Settings settings={Usersettings} hideModal={()=> setOptionsModal(false)}/>}

{(showModal || modalTriggered) && (<UserModal url={url} username={user?.username} 
email={user?.email} firstName={user?.firstName} lastName={user?.lastName}
pictureUrl={user.picture} Region={region?.name} RegionId={region?.id}/>)}   

</div>                   
 )
}