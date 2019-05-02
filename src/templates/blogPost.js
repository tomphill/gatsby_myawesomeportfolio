import React from 'react'
import Layout from '../components/layout'
import axios from 'axios'
import styled from 'styled-components'
import moment from 'moment';

const CommentsWrapper = styled.section`
  padding: 16px;
  border: 1px solid #eee;
  margin: 32px 0;
`

const CommentsInfoLabel = styled.div`
  text-align: center;
  color: #999;
  margin-top: 16px;
`

const Comment = styled.div`
  border-top: 1px solid #eee;
`

const Avatar = styled.div`
  border-radius: 50%;
  height: 48px;
  width: 48px;
  background-size: cover;
  margin-right: 8px;
  box-shadow: 0 0 5px #999;
  background: ${props => `url("${props.imgSrc}")`};
`

const CommentContent = styled.div`
  margin-left: 56px;
  p{
    margin: 0;
  }
`

const commonFormStyles = `
  width: 50%;
  display: block;
  margin: 8px 0;
  border: 1px solid #eee;
  font-size: 14px;
  font-family: 'Open Sans', sans-serif;
  padding: 8px;
  box-sizing: border-box;
  
  @media screen and (max-width: 600px) {
    width: 100%;
  }  
`

const Input = styled.input`
  ${commonFormStyles}
`

const Textarea = styled.textarea`
  resize: none;
  ${commonFormStyles}
`

const Button = styled.button`
  width: ${props => props.fullWidth ? '100%' : '50%'};
  font-size: 14px;
  font-family: 'Open Sans', sans-serif;
  padding: 8px;
  display: block;
  margin-bottom: 16px;
  
  @media screen and (max-width: 600px) {
    width: 100%;
  } 
`

const CommentDateTime = styled.time`
  display: block;
  margin-left: 56px;
  font-size: 75%;
  color: #999;
  margin-bottom: 8px;
`

const CommentUserInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: 8px;
`

export default class extends React.Component {

    state = {
        comments: [],
        nextComments: [],
        loadingComments: false,
        commentName: '',
        commentEmail: '',
        commentText: '',
        showLoadMoreCommentsButton: false
    }

    commentsPerPage = 5
    commentsApiUrl = process.env.GATSBY_COMMENTS_API_URL

    componentDidMount(){
        if(typeof window !== 'undefined'){
            this.setState({
                loadingComments: true
            })

            const commentsPerPage = this.commentsPerPage
            const wordpressId = this.props.pageContext.wordpress_id
            const url = `${this.commentsApiUrl}?post=`
            axios.get(`${url}${wordpressId}&per_page=${commentsPerPage}`).then((result) => {
                const comments = result.data;

                if(comments.length === commentsPerPage){
                    const before = comments[comments.length - 1].date
                    axios.get(`${url}${wordpressId}&per_page=${commentsPerPage}&before=${before}`).then((next) => {
                        this.setState({
                            loadingComments: false,
                            comments,
                            nextComments: next.data,
                            showLoadMoreCommentsButton: !!next.data.length
                        })
                    })
                }else{
                    this.setState({
                        loadingComments: false,
                        comments,
                        showLoadMoreCommentsButton: false
                    })
                }
            })
        }
    }

    handleInput = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleCommentSubmit = (e) => {
        e.preventDefault();
        const {commentName, commentEmail, commentText} = this.state;
        if(commentName && commentEmail && commentText){
            axios.post(`${this.commentsApiUrl}`, {
                post: this.props.pageContext.wordpress_id,
                author_name: commentName,
                author_email: commentEmail,
                content: commentText
            }).then((result) => {
                this.setState({
                    comments: [result.data, ...this.state.comments]
                })
            })
        }
    };

    handleLoadMoreCommentsClick = () => {
        const commentsPerPage = this.commentsPerPage
        const wordpressId = this.props.pageContext.wordpress_id
        const url = `${this.commentsApiUrl}?post=`
        const {nextComments} = this.state;
        const before = nextComments[nextComments.length - 1].date

        axios.get(`${url}${wordpressId}&per_page=${commentsPerPage}&before=${before}`).then((result) => {
            this.setState({
                comments: [...this.state.comments, ...nextComments],
                nextComments: result.data,
                showLoadMoreCommentsButton: !!result.data.length
            })
        })
    };

    render(){
        const {pageContext} = this.props;
        return(
            <Layout>
                <h1 dangerouslySetInnerHTML={{__html: pageContext.title}} />
                <div dangerouslySetInnerHTML={{__html: pageContext.content}} />
                <CommentsWrapper>
                    <h3>
                        Comments
                    </h3>
                    {!this.state.loadingComments &&
                    <form onSubmit={this.handleCommentSubmit}>
                        <h4>
                            Post a comment
                        </h4>
                        <Input required type="email" name="commentEmail" placeholder="Email" onChange={this.handleInput} />
                        <Input required name="commentName" placeholder="Name" onChange={this.handleInput} />
                        <Textarea required name="commentText" placeholder="Comment" onChange={this.handleInput} />
                        <Button type="submit">
                            Post
                        </Button>
                    </form>
                    }
                    {this.state.loadingComments &&
                    <CommentsInfoLabel>
                        Loading comments...
                    </CommentsInfoLabel>
                    }
                    {!this.state.loadingComments && !this.state.comments.length &&
                    <CommentsInfoLabel>
                        No comments yet!
                    </CommentsInfoLabel>
                    }
                    {!this.state.loadingComments && !!this.state.comments.length &&
                    <section>
                        {this.state.comments.map((comment, index) => (
                            <Comment key={index}>
                                <CommentUserInfo>
                                    <Avatar imgSrc={comment.author_avatar_urls['48']} />
                                    <div>
                                        <strong>
                                            {comment.author_name}
                                        </strong>
                                    </div>
                                </CommentUserInfo>
                                <CommentContent dangerouslySetInnerHTML={{__html: comment.content.rendered}} />
                                <CommentDateTime>
                                    {moment(comment.date).format('Do MMM YYYY HH:mm')}
                                </CommentDateTime>
                            </Comment>
                        ))}
                        {this.state.showLoadMoreCommentsButton &&
                            <Button fullWidth onClick={this.handleLoadMoreCommentsClick}>
                                Load more comments
                            </Button>
                        }
                    </section>
                    }
                </CommentsWrapper>
            </Layout>
        )
    }
}