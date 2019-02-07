import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4'

//type def (schema)
const users = [
    {
        id: '20',
        name: 'mohit',
        age: 30,
        email: 'mohitdutt91@gmail.com',
        post: '20'
    },
    {
        id: '100',
        name: 'tin',
        age: 30,
        email: 'mohitdutt91@gmail.com',
        post: '30'

    },
    {
        id: '50',
        name: 'subh',
        age: 30,
        email: 'mohitdutt91@gmail.com',
        post: '80'
    },
]



const posts = [
    {
        id: '20',
        title: 'mypost',
        Published: 'today',
        author: '50'
    },
    {
        id: '50',
        title: 'mypost2',
        Published: 'today',
        author: '100'
    },
    {
        id: '30',
        title: 'mypost3',
        Published: 'today',
        author: '50'
    },
    {
        id: '80',
        title: 'asd',
        Published: 'today',
        author: '100'
    }

]

const comments =[];


const typeDefs = `
    type Mutation{
        createUser(name:String!, email:String!, age:Int):User!,
        createPost(title:String!, published:String!, author:ID!):Post!,
        createComment(text:String!, author:ID!, post:ID):Comment!
    }

    type Query{
        posts(query:String):[Post!]
        post: Post!,
        add(numbers:[Float]!):String,
        greet(name:String):String,
        users(query:String): [User!],
        comments:[Comment!]
    }

    type Post{
        id:ID!,
        title:String!,
        Published:String!,
        author:User!
    } 

    type Comment{
        id:ID!,
        post:Post!,
        txtComment:String,
        author:User!
    }
    
    type User{
        id:ID!,
        name:String!,
        age:Int!,
        email:String!,
        post:Post!
    }
    `

//resolvers (function runs on various operations)
const resolvers = {
    Query: {
        posts(parent, args, ctx, info) {
            if (!args.query) {
                return posts;
            } else {
                for (let i = 0; i < posts.length; i++) {
                    if (posts[i].title.toLowerCase() == args.query.toLowerCase()) {
                        console.log('post i', posts[i]);
                        return [posts[i]];
                    }
                }
            }
        },

        post() {
            return {
                id: '20',
                title: 'test post',
                Published: '2 days ago'
            }
        },
        greet(parent, args, ctx, info) {
            return `hello ${args.name}`
        },

        add(parent, args, ctx, info) {
            return args.numbers.reduce((acc, item) => {
                return acc + item
            }, 0)
        },

        users(parent, args, ctx, info) {
            return users;
        },
        comments(){
            return comments
        }
    },
    Mutation:{
        createComment(parent,args,ctx,info){
            const ifUserExists = users.some(usr => usr.id == args.author)
            const ifPostExists = posts.some(post=> post.id == args.post)
            if(!ifUserExists){
                throw new Error('user does not exist')
            } 
            else if(!ifPostExists){
                throw new Error('post does not exist')
            }
            else{
                const comment = {
                    id: uuidv4(),
                    txtComment: args.text,
                    author: args.author,
                    post: args.post
                }

                comments.push(comment);
                return comment;
            }


        },
        createUser(parent,args,ctx,info){
           const emailTaken = users.some(user=> user.email === args.email);
           if(emailTaken){
               throw new Error('email already taken');
           }

           const user ={
               id: uuidv4(),
               name: args.name,
               email: args.email,
               age: args.age
           }

           users.push(user);
           return user;
           
        },

        createPost(parent, args, ctx, info){
            const userExists = users.some(user=> user.id == args.author);
            if(!userExists){
                throw new Error('user does not exists');
            }

            const post = {
                id:uuidv4(),
                title:args.title,
                published: args.published,
                author: args.author
            }

            posts.push(post);
            return post;
        }
    },
    Post: {
        author(parent, args, ctx, info) {
            return users.find(user => {
                return user.id === parent.author;
            })
        }
    },
    User: {
        post(parent, args, ctx, info) {
            // return posts.filter(item=>{
            //     return item.id == parent.post;
            // })
            for (let i = 0; i < posts.length; i++){
                if(parent.post == posts[i].id){
                    return posts[i]
                }
            }
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
})

server.start(() => {
    console.log('server is started');
})