"use client"
import type {following} from './dashboard_component'
import {useState, useEffect, useMemo} from 'react'
import debounce from 'lodash.debounce'
import {fetchAuth} from '../components/fetch'

type followerModalProps = {
    followers: following
}

type User = {
    id: number
    username: string
    picture: string
}
type followers = User[]

export default function FollowersModal({followers}: followerModalProps){
    const [followerToggled, setFollowerToggled] = useState(true)
    const [followingToggled, setFollowingToggled] = useState(false)
    const [filteredFollowing, setFilteredFollowing] = useState<followers>([])
    const [inputValue, setInputValue] = useState("")

    const handle_filtering = useMemo(()=>
     debounce((input: string)=>{
            if (input.length < 2){
                setFilteredFollowing([])
                return
            }
            const fetch_url = `${process.env.NEXT_PUBLIC_API_URL}/get_followers?name=${input}`
            fetchAuth(fetch_url, {method: 'GET'}).then(res=> res.json()).then(data => 
                {setFilteredFollowing(data.users); console.log(data.users)})
        }, 500),
     [])
    
    

    return (
        <div id="followers_modal_bg">
              <div className="followers_modal">
                <div className='btn_cont_followers'>

                    <button className={followerToggled ?'toggle_btn_followers toggled_follow'
                                                       :"toggle_btn_followers"}
                    onClick={()=>{setFollowingToggled(false); setFollowerToggled(true)}}>
                        Following
                    </button>
                    <button className={followingToggled?'toggle_btn_followers toggled_follow'
                                                       : 'toggle_btn_followers' }
                    onClick={()=>{setFollowerToggled(false); setFollowingToggled(true)}}>
                        Followers
                    </button>

                </div>
                
                 
                 <div className='following_containers'>
                    <div className='input_cont_follower_modal'>
                       <input type='text' name='following' placeholder='Search ...' 
                         onChange={(e)=> {handle_filtering(e.target.value); setInputValue(e.target.value) }}/>
                    </div>
                    
                    
                    {(inputValue.length < 1 ) && followers.map(f=>{
                        return <div className="single_follower" key={f.id}>
                            
                            <img src={f.picture ? f.picture : "/avatar.png"} 
                            className='picture_user_follower_modal'/> 
                            {f.username}

                            <button className='unfollow_dash_btn'>Unfollow</button>
                        </div>
                 
                    })}
                    {filteredFollowing && filteredFollowing.map(f=>{
                        return <div className="single_follower" key={f.id}>
                            {f.username}
                            <button className='unfollow_dash_btn'>Unfollow</button>
                        </div>
                 
                    }) }
                    {((filteredFollowing && filteredFollowing.length < 1) && inputValue.length >= 2) && 
                    <div className="no_match_follower">
                            No match for this name
                        </div>}
                    </div>
              </div>
        </div>
    )
}