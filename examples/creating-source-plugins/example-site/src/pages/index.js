import React from "react"
import { graphql } from "gatsby"
import { styled } from '@mui/material/styles';
import { Box, Grid, Paper } from "@mui/material";

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

export default ({ data }) => (
  <>
    <h1>Ecommerce Site Powered by Bolt</h1>
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={3}>
        {data.allPost.nodes.map(post => (
          <Grid item xs={3}>
            <Item>
              <h2>{post.slug}</h2>
              <span>By: {post.author.name}</span>
              <p>{post.description}</p>
            </Item>
          </Grid>
        ))}
      </Grid>
    </Box>
  </>
)

export const query = graphql`
  {
    allPost {
      nodes {
        id
        slug
        description
        imgAlt
        author {
          id
          name
        }        
      }
    }
  }
`