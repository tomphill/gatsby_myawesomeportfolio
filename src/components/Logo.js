import { graphql, StaticQuery } from 'gatsby'
import React from 'react'
import styled from 'styled-components'

const logoQuery = graphql`
{
  allWordpressWpLogo{
    edges{
      node{
        url{
          source_url
        }
      }
    }
  }
}
`;

const ImgWrapper = styled.div`
  margin: auto 0;
  padding-right: 8px;
`

const Img = styled.img`
  max-height: 40px;
  display: block;
`

export default () => (
    <StaticQuery query={logoQuery} render={(data) => (
        <ImgWrapper>
            <Img alt="TomPhill Ltd logo" src={data.allWordpressWpLogo.edges[0].node.url.source_url} />
        </ImgWrapper>
    )} />
);