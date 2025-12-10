"use client"
import type {following} from './dashboard_component'
import {useState, useEffect, useMemo} from 'react'
import debounce from 'lodash.debounce'
import {fetchAuth} from '../components/fetch'
import $ from 'jquery'
type User = {
    id: number
    username: string
    picture: string
}
type followers = User[]
type FollowerModalProps = {
    closeModal : () => void
}
export default function FollowersModal({closeModal}: FollowerModalProps){
    const [followerToggled, setFollowerToggled] = useState(false)
    const [followingToggled, setFollowingToggled] = useState(true)
    const [filteredFollowing, setFilteredFollowing] = useState<followers>([])
    const [filteredFollower, setFilteredFollower] = useState<followers>([])
    const [inputValue, setInputValue] = useState("")
    const [followers, setFollowers] = useState<followers>([])
    const [followed, setFollowed] = useState<followers>([])

 const url = process.env.NEXT_PUBLIC_API_URL

 const unfollow = async (id:number) =>{
        const unfollow_url = `${url}/unfollow/user/${id}`
        await fetchAuth(unfollow_url, {method: 'POST'}).then(res=> res.status == 200 ? "" : 
        alert('There was a problem unfollowing , try again later'))

      setFollowed(prev => prev.filter(f => f.id !== id))

     }

const clearInput = ()=>{
     setInputValue("")
    $('#search_input').val('')
}

 useEffect(()=>{
   const fetch_url =  `${process.env.NEXT_PUBLIC_API_URL}/get_followers`
   fetchAuth(fetch_url, {method: 'GET'}).then(res=> res.json()).then(data=> 
    {setFollowers(data.users_follower); setFollowed(data.users_followed)})
 }, [])

    const handle_filtering = (input:string, type: string)=>{
        if (input.length > 0){

        
        if(type == 'followed'){
        const results = followed.filter(res=> res.username.toLowerCase().includes(input.toLowerCase()));
        setFilteredFollowing(results)
        }else{
             const results = followers.filter(res=> res.username.toLowerCase().includes(input.toLowerCase()));
        setFilteredFollower(results)


        }
        }else{
            setFilteredFollowing([])
        }
    } 
    

    return (
        <div id="followers_modal_bg">
              <div className="followers_modal">
                <button type='button' onClick={()=>{closeModal()}} className='x_btn_modal_followers_dash'>X</button>
                <div className='btn_cont_followers'>

                    <button className={followerToggled ?'toggle_btn_followers toggled_follow'
                                                       :"toggle_btn_followers "}
                    onClick={()=>{setFollowingToggled(true); setFollowerToggled(false);clearInput()}}>
                        Following
                    </button>
                    <button className={followingToggled?'toggle_btn_followers toggled_follow'
                                                       : 'toggle_btn_followers ' }
                    onClick={()=>{setFollowerToggled(true); setFollowingToggled(false); clearInput()}}>
                        Followers
                    </button>

                </div>
                
                <div className='input_cont_follower_modal'>
                       <input type='text' name='following' placeholder='Search ...' id='search_input' 
                         onChange={(e)=> {handle_filtering(e.target.value, followingToggled ? 'followed'
                                                        : 'followers'); setInputValue(e.target.value)}}/>
                </div>
                 <div className='following_containers'>

                    
    {followingToggled && (
                        <>
                    {(filteredFollowing.length < 1 && inputValue.length < 1 ) && followed.map(f=>{
                        return <div className="single_follower" key={f.id}>
                            
                            <img src={f.picture ? f.picture : "/avatar.png"} 
                            className='picture_user_follower_modal'/> 
                            {f.username}

                            <button className='unfollow_dash_btn' 
                            onClick={()=> unfollow(f.id)}>Unfollow</button>
                        </div>
                 
                    })}
                   
                        
                    {filteredFollowing && filteredFollowing.map(f=>{
                        return <div className="single_follower" key={f.id}>
                            <img src={f.picture ? f.picture : "/avatar.png"} 
                            className='picture_user_follower_modal'/> 
                            {f.username}
                            <button className='unfollow_dash_btn'
                            onClick={()=> unfollow(f.id)}>Unfollow</button>
                        </div>
                 
                    }) 
                    }
              
                    {((filteredFollowing && filteredFollowing.length < 1) && inputValue.length >= 2) && 
                    <div className="no_match_follower">
                            No match for this name
                        </div>} 
                        </>)}

    {followerToggled && (
                        <>
                    {(filteredFollower.length < 1 && inputValue.length < 1 ) && followers.map(f=>{
                        return <div className="single_follower" key={f.id}>
                            
                            <img src={f.picture ? f.picture : "/avatar.png"} 
                            className='picture_user_follower_modal'/> 
                            {f.username}

                         
                        </div>
                 
                    })}
                    {filteredFollower && filteredFollower.map(f=>{
                        return <div className="single_follower" key={f.id}>
                                                        <img src={f.picture ? f.picture : "/avatar.png"} 
                            className='picture_user_follower_modal'/> 
                            {f.username}
                           
                        </div>
                 
                    }) }
                    {((filteredFollower && filteredFollower.length < 1) && inputValue.length >= 2) && 
                    <div className="no_match_follower">
                            No match for this name
                        </div>} 
                        </>)}
                       
                    </div>
              </div>
        </div>
    )
}