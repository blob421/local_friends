import type {User, stats, Badge} from '../../types_dashboard'
import $ from 'jquery'
import Image from 'next/image'
import {useState, useEffect} from 'react'

type SummaryProps = {
    user: User, visitor: boolean, reqUser:string, unfollow: () => void, following:boolean,
    setModalTriggered: (bool:boolean) => void, userStats?:stats, 
    setAnimalModal: (bool:boolean) => void, badges: Badge[], obtainedBadges: number[],
  
}

export default function SummaryComponent({user, visitor, reqUser, unfollow, following,
    setModalTriggered, userStats, setAnimalModal, badges, obtainedBadges}: SummaryProps ){
    
    const url = process.env.NEXT_PUBLIC_API_URL
    const [hoveredBadge, setHoveredBadge] = useState<number | null>(null)
    if (user.Animal)
    user.Animal.name = user.Animal.name ? user.Animal.name[0].toUpperCase() +
    user.Animal.name.substring(1): ""

  
    return ( 
    <div className="col-lg-11">
        
                <div className="row justify-content-center g-0">
                 
                     <div className="col-12 mb-1 mb-lg-0 top_bar_dashboard">
                       {!visitor ? `Welcome ${user?.username}`
                                 : `You are viewing the profile of ${user?.username}` }

                      {(reqUser !== user?.id && following) && <button className="unfollow"
                      onClick={() => unfollow()}>
                        Unfollow
                        </button>
                        }
                     </div>
                </div>

                <div className="row d-flex justify-content-center top_dash_row">
                  
                    <div className="col-lg-5">
                          <div className="rectangle mt-1 mb-2 m-large-2 m-0">
                           {!visitor && <Image src={"/pen.png"} alt="Edit" height={25} 
                            width={25} className="edit_icon_dash"
                            onClick={
                              ()=>{ 
                              setModalTriggered(true); 
                              $('#profile_modal_bg').show()
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                              }
                              }/>}

                           
                              <div className="account_top dashboard_squares_titles">
                                  Account
                              </div>
                              <div className="account_bot">

                                <div className="photo_right">

                                    {user.picture && <img src={url + user.picture} 
                                    className="profile_pic_dash"></img>}

                                    {!user.picture && <img src={'/avatar.png'}
                                    alt="profile picture">
                                    </img>}

                                </div>

                                <div className="info_left">
                                  
                                 <div className="user_square_ul">
                                        <div><strong>Username: </strong>{user.username}</div>
                                        <div><strong>Name: </strong>{user.firstName + " "}{user.lastName}</div>
                                        <div className="text_elipsis"><strong>Email: </strong>{user.email}</div>
                                        <div><strong>Region: </strong>{user.Region?.name? user.Region.name: 
                                            <div className="add_a_region_red">
                                            Add a region to unlock the feed
                                            </div>
                                            }
                                        </div>

                                </div>
                                </div>
                                 
                              </div>

                          </div>
                    </div>
                      <div className="col-lg-5">
                          <div className="rectangle mt-1 mb-2 m-large-2 m-0">
                               <div className="stats_top dashboard_squares_titles">
                                 Stats
                               </div>
                                <div className="stats_bot">
                                   <ul>
                                        <li>Animals found: {userStats?.found ?? '-'}</li>
                                        <li>Followed : {userStats?.following ?? '-'}</li>
                                        <li>Followers : {userStats?.followers ?? '-'}</li>
                                   </ul>
                               </div>
                            
                          </div>            
                        
                    </div>
                
                </div>
                <div className="row justify-content-center">
                  
              <div className="col-lg-5">
                    <div className="rectangle mt-1 mb-2 m-large-2 m-0">
                        {!visitor &&<Image src={"/pen.png"} alt="Edit" height={25} 
                      width={25} className="edit_icon_dash"
                      onClick={
                        ()=>{ 
                        setAnimalModal(true); 
                        $('#profile_modal_bg_animal').show()
                        }
                        }/>}
                          <div className="team_upper dashboard_squares_titles">
                              {user.TeamId}
                              {!user.TeamId && 'Team'}

                          </div>
                          
                          <div className="teams_grid">
                                <div className="animal_pic_cont">
                                        {user.Animal && 
                                        <img src={user.Animal.picture}
                                          alt="" className="animal_ico">
                                        </img>}
                                </div>
                              
                                {!user.Animal && <div className="no_team_content">
                                      No team yet , click on the pen icon and pick your favorite animal ⭐
                                      </div>
                                      }
                                <div className="animal_desc_dash">
                                  
                              
                                    <div className="animal_title_dash">
                                    {user.Animal && user.Animal.name}
                                      </div>
                                    {user.Animal && <div className="animal_text_dash">
                                      {user.Animal.description}

                                    </div>}   
                              </div>
                          
                          </div>
                    </div>
              </div>
                <div className="col-lg-5">
                    <div className="rectangle mt-1 mb-2 m-large-2 m-0">
                        <div className="badges_title dashboard_squares_titles">
                          Badges
                        </div>

                        <div className="badge_grid_dash">
                        {badges.map(b=>{
                          return <div className={"single_badge_div"} key={b.id}>
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
        </div>
    )
}