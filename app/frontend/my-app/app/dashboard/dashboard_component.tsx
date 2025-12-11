"use client";
import { useEffect, useState } from "react"
import { fetchAuth } from '../components/fetch';
import Image from 'next/image'
import $ from 'jquery'
import dynamic from 'next/dynamic';
import { decodeUrlSafe } from "../components/encode";

const FirstLoginModal = dynamic(()=> import('./first_login_modal'))
const FollowersModal = dynamic(()=> import('./followers_modal'))
const UserModal = dynamic(()=> import('./user_info_modal'))
const AnimalModal = dynamic(() => import('./animal_modal'))
const Settings = dynamic(()=> import('./options_modal'))

type Region = {id : Number 
   name: string;}

type DashboardProps = {visitor: boolean}

type Settings= {showEmail : boolean 
  postScopeRegion: boolean
    firstLogin: boolean
}
type stats = {
  found: number
}
export type UserBadge = {
  awardedAt: string
  UserId: number
  BadgeId: number
}
export type Badge ={ 
  description: string
  name: string
  picture: string
  id: number
  TeamId: number
}

export type User = {
    id: number
    username: string
    picture: string
}

export type following = User[]
type followers = number[]

export default function DashboardMain({visitor}: DashboardProps){
  
     const url = process.env.NEXT_PUBLIC_API_URL
     const [username, setUsername] = useState("")
     const [id, setid] = useState("")
     const [firstName, setFirstName] = useState('')
     const [lastName, setLastName] = useState('')
     const [team, setTeam] = useState("")
     const [email , setEmail] = useState("")
   
     const [animalName , setanimalName] = useState("")
     const [animalDesc , setanimalDesc] = useState("")
     const [animalPic , setanimalPic] = useState(null)
     const [Usersettings, setUserSettings] = useState<Settings>({ 
      showEmail: false, postScopeRegion: false, firstLogin:false });

     const [region , setRegion] = useState<Region | null >(null)
     const [pictureUrl, setPicture] = useState("")

     const [badges, setBadges] = useState<Badge[]>([])
     const [userBadge, setUserBadge]= useState<UserBadge[]>([])
     const [obtainedBadges, setObtainedBadges] = useState<number[]>([])
     const [hoveredBadge, setHoveredBadge] = useState<number | null>(null)

     const [showModal, setModal] = useState(false)
     const [modalTriggered, setModalTriggered] = useState(false)
     const [animalModal, setAnimalModal] = useState(false)
     const [optionsModal, setOptionsModal] = useState(false)
     const [following, setFollowing] = useState(true)
     const [userStats, setStats] = useState<stats | null>(null)
     const [followClicked, setFollowClicked] = useState(false)
     const [followClicked2, setFollowClicked2] = useState(false)
     const [reqUser, setReqUser] = useState("")
     const [followerModal, setFollowerModal] = useState(false)
    // const [following_users, setFollowingUsers] = useState<following>([])

     const [activeHint, setHint] = useState("")

     const unfollow = async () =>{
        const unfollow_url = `${url}/unfollow/user/${id}`
        await fetchAuth(unfollow_url, {method: 'POST'}).then(res=> res.status == 200 ? location.reload() : 
      alert('There was a problem unfollowing , try again later'))
     }

     useEffect(()=>{
       const fetch_data = async () =>{
       const params = new URLSearchParams(window.location.search)
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
          setFirstName(data.user.firstName?data.user.firstName: "--")
          setLastName(data.user.lastName)
          setTeam(data.user.TeamId)
          setEmail(data.user.email)
          setStats(data.stats)
          setid(data.user.id)
          const animal_Name = data.user.Animal?.name
          if (animal_Name){
          setanimalName(animal_Name[0].toUpperCase() + animal_Name.substring(1))
          setanimalPic(data.user.Animal.picture)
          setanimalDesc(data.user.Animal.description)
          }

          setBadges(data.badges)
          if (data.UserBadges.length > 0){
            setUserBadge(data.UserBadges)
          }
          setReqUser(data.req_user)
          console.log(data.user)
          setUsername(data.user.username)
          setUserSettings(data.settings)
          if( data.user.Region){
            setRegion(data.user.Region)
          }else{
             $('.home_link').hide()
            $('.map_link').hide()
          }
          
          setPicture(data.user.picture)

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
 

        if (!following){
        const popup = $('#follow_popup')
        popup.addClass('popup_expanded')
        }

       }

  expand_pop_up()
}, [following, id])

useEffect(()=>{
 
   const badgeIds= badges.map(b=> b.id)
   const UserBadgeIds = userBadge.map(b=>b.BadgeId)
   const obtained = badgeIds.filter(b=> UserBadgeIds.includes(b))
   setObtainedBadges(obtained)
    
}, [badges, userBadge])

const follow = async () => {
    const follow_url = `${url}/follow/${id}`
    await fetchAuth(follow_url, {method: 'POST'}).then(res=>{ 
      if (res.status == 400){
         alert('Oops , something went wrong with your request')
      }
    })
   }
   
   
     return (
      <div className="dash_cont" id="dash_cont">
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
           <div className="col-md-1 d-flex flex-row flex-md-column
               align-items-center pt-2 pb-2 pt-md-4 pb-md-0 menu_options">

              <div className="dash_img_menu_cont">

                   <Image src="/person.jpg" alt="person_icon" 
                    width={30} height={30}/>

                    <div className={"hint_div_dash"}>Profile</div>
                  
              </div>

        
              {!visitor && <Image src="/group_icon.png" alt="stats_icon" 
              width={30} height={30} onClick={()=> setFollowerModal(true)}/>}
             
              {!visitor && <Image src="/gear_icon.png" alt="gear_icon" 
              className={optionsModal ? 'selected_tab_dash dash_tab_icon': "dash_tab_icon"}
              width={30} height={30} onClick={()=> setOptionsModal(true)}/>}
          
              


           </div>
            <div className="col-md-11">

                <div className="row justify-content-center">
                 
                     <div className="col-12 top_bar_dashboard">
                       {!visitor ? `Welcome ${username}`
                                 : `You are viewing the profile of ${username}` }

                      {(reqUser !== id && following) && <button className="unfollow"
                      onClick={() => unfollow()}>
                        Unfollow
                        </button>
                        }
                     </div>
                </div>
                <div className="row justify-content-center">
                  
                    <div className="col-md-5">
                          <div className="rectangle">
                              {!visitor &&<Image src={"/pen.png"} alt="Edit" height={25} 
                            width={25} className="edit_icon_dash"
                            onClick={
                              ()=>{ 
                              setAnimalModal(true); 
                              $('#profile_modal_bg_animal').show()
                              }
                              }/>}
                                <div className="team_upper">
                                   {team}
                                   {!team && 'Team'}

                                </div>
                                
                                <div className="teams_grid">
                                     <div className="animal_pic_cont">
                                              {animalPic && 
                                              <img src={animalPic}
                                                alt="" className="animal_ico">
                                              </img>}
                                     </div>
                                    
                                      {!animalPic && <div className="no_team_content">
                                            No team yet , click on the pen icon and pick your favorite animal ⭐
                                           </div>
                                           }
                                     <div className="animal_desc_dash">
                                       
                                   
                                          <div className="animal_title_dash">
                                          {animalName}
                                            </div>
                                          {animalName && <div className="animal_text_dash">
                                           {animalDesc}

                                          </div>}   
                                   </div>
                                
                                </div>
                          </div>
                    </div>
                      <div className="col-md-5">
                          <div className="rectangle">
                              <div className="badges_title">
                                Badges
                              </div>

                              <div className="badge_grid_dash">
                              {badges.map(b=>{
                                return <div className={"single_badge_div"}>
                                        <img src={b.picture} className={obtainedBadges.includes(b.id) ? 
                                          "badge_image": "badge_image grey_badge"}
                                            onMouseEnter={()=>{setHoveredBadge(b.id)}}
                                            onMouseLeave={()=>{setHoveredBadge(null)}}
                                            onClick={()=>{setHoveredBadge(b.id)}}/>

                                            <div className={hoveredBadge == b.id ? "badge_desc_info visible"
                                                                                 : "badge_desc_info"
                                            } 
>

                                              {b.description}
                                            </div>
                                       </div>        
                              })}
                            </div>

                          </div>            
                        
                    </div>
                
                </div>
                <div className="row d-flex justify-content-center">
                  
                    <div className="col-md-5">
                          <div className="rectangle">
                           {!visitor && <Image src={"/pen.png"} alt="Edit" height={25} 
                            width={25} className="edit_icon_dash"
                            onClick={
                              ()=>{ 
                              setModalTriggered(true); 
                              $('#profile_modal_bg').show()
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                              }/>}

                           
                              <div className="account_top">
                                  Account
                              </div>
                              <div className="account_bot">

                                <div className="photo_right">

                                    {pictureUrl && <img src={url + pictureUrl} 
                                    className="profile_pic_dash"></img>}

                                    {!pictureUrl && <img src={'/avatar.png'}
                                    alt="profile picture">
                                    </img>}

                                </div>

                                <div className="info_left">
                                  
                                    <ul>
                                        <li>Username: {username}</li>
                                        <li>Name: {firstName + " "}{lastName}</li>
                                        <li className="text_elipsis">Email: {email}</li>
                                        <li>Region: {region?.name? region.name: <div className="add_a_region_red">
                                          Add a region to unlock the feed
                                          </div>}</li>
                                      </ul>

                                </div>

                                 
                              </div>

                          </div>
                    </div>
                      <div className="col-md-5">
                          <div className="rectangle">
                               <div className="stats_top">
                                 Stats
                               </div>
                                <div className="stats_bot">
                                   <ul>
                                        <li>Animals found: {userStats?.found ? userStats.found: '0'}</li>
                                   </ul>
                               </div>
                            
                          </div>            
                        
                    </div>
                
                </div>
            </div>
     </div>

{Usersettings.firstLogin && <FirstLoginModal/>}
{followerModal && <FollowersModal closeModal={()=> setFollowerModal(false) }/>}
{animalModal && <AnimalModal url={url}/>}

{optionsModal && <Settings settings={Usersettings} hideModal={()=> setOptionsModal(false)}/>}

{(showModal || modalTriggered) && (<UserModal url={url} username={username} 
email={email} firstName={firstName} lastName={lastName}
pictureUrl={pictureUrl} Region={region?.name} RegionId={region?.id}/>)}   

</div>                   
 )
}