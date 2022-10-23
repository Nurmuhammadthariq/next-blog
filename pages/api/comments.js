import { GraphQLClient, gql } from "graphql-request"

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT

export default async function comments(req, res) {
  const graphClient = new GraphQLClient((graphqlAPI), {
    headers: {
      authorization: `Bearer ${process.env.GRAPHCMS_TOKEN}`
    }
  })

  const query = gql`
    mutation CreateComment($name: String!, $email: String!, $comment: String!, $slug: String!) {
      createComment(data: {
        name: $name,
        email: $email,
        comment: $comment,
        post: { connect: { slug: $slug } }
      }) { id }
    }
  `
  try {
    const result = await graphClient.request(query, {
      name: req.body.name,
      email: req.body.email,
      comment: req.body.comment,
      slug: req.body.slug
    })
    return res.status(200).send(result);
  } catch (error) {
    console.log(error)
    return res.status(500).send(error);
  }
  // res.status(200).json({ name: 'John Doe', email: 'johndoe@gmail.com', age: '24' })
}
