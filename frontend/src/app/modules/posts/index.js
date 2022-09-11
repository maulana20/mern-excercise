import React, { useEffect } from 'react';
import useRequest from '@ahooksjs/use-request';
import { getPosts } from '../../../services/posts/api';

const Posts = () => {
  const { loading: loadingPosts, run: fetchPosts } = useRequest(getPosts, {
    manual: true
  });
  
  useEffect(() => {
    fetchPosts();
  }, []);
  
  return loadingPosts ? (
    <div>loading</div>
  ) : (
    <section className="container">
      <h1 className="large text-primary">Posts</h1>
      <p className="lead">
        <i className="fas fa-user" /> Welcome to the community
      </p>
      <div className="posts">
        post list
      </div>
    </section>
  );
}

export default Posts;
