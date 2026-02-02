
export type Region = {id : number 
   name: string | undefined;}

export type stats = {
  found: number
  followers: number
  following: number
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
    id: string, TeamId: string | undefined, username: string | undefined, 
    picture: string | undefined, Region: Region
    firstName: string | undefined, 
    Animal: {name: string | undefined , 
    description: string | null, picture: string | undefined}
    lastName: string | undefined, email: string | undefined
}

export const baseUser = { id: '0', TeamId:undefined, username:undefined, picture: undefined, 
  firstName:undefined, Region: {id: 0, name: undefined}, 
  Animal: {name: undefined, description: null, picture: undefined},
  lastName: undefined, email:undefined
}