import React from 'react'
import Layout from '../components/layout'
import styled from 'styled-components'
import moment from 'moment'
import {Link} from 'gatsby'

const PostListItem = styled.div`
  padding: 16px;
  border-bottom: 1px solid #eee;
`

const PaginationWrapper = styled.section`
  display: flex;
  margin-top: 16px;
  margin-bottom: 40px;
`

const Pagination = styled.section`
  display: flex;
  margin-left: auto;
`

const PaginationItem = styled.div`
  padding: 8px 16px;
  display: block;
  border: 1px solid #eee;
  background: ${props => !!props.active ? '#eee' : 'white'}
`

const ReadMoreLinkWrapper = styled.div`
  text-align: right;
`

export default ({pageContext}) => (
    <Layout>
        {pageContext.posts.map(post => (
            <PostListItem key={post.node.id}>
                <h3 dangerouslySetInnerHTML={{__html: post.node.title}} />
                <small>
                    <time>{moment(post.node.date).format('Do MMM YYYY HH:mm')}</time>
                </small>
                <p dangerouslySetInnerHTML={{__html: post.node.excerpt}} />
                <ReadMoreLinkWrapper>
                    <Link to={`/post/${post.node.slug}`}>
                        Read more
                    </Link>
                </ReadMoreLinkWrapper>
            </PostListItem>
        ))}
        <PaginationWrapper>
        <Pagination>
            {Array.from({length: pageContext.numberOfPages}).map((page, index) => (
                <PaginationItem
                    active={pageContext.currentPage === index + 1}
                    key={index}>
                    <Link to={index === 0 ? '/blog' : `/blog/${index + 1}`}>
                        {index + 1}
                    </Link>
                </PaginationItem>
            ))}
        </Pagination>
        </PaginationWrapper>
    </Layout>
);