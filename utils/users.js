class Users{
    constructor(name,age)
        {
        this.users=[]
        }


    addUser(id,name,room,id_user,email){
        let user = {id, name , room, id_user, email}
        this.users.push(user);
        return user
    }    

    getUserList(room){
        let users=this.users.filter((user)=>user.room === room);
        let numArray=users.map((user)=>{ return {name:user.name, id:user.id_user, idsocket:user.id, email:user.email }})

        return numArray;
    }

    getUser(id){
        return this.users.filter((user)=>user.id === id)[0];
    }

    removeUser(id){
        let user = this.getUser(id);
        if(user){
            this.users=this.users.filter((user)=>user.id !== id)
        }

        return user;
    }


}

module.exports = { Users };