import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers, incrementSkip } from '../features/userSlice';

const UserList = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users.users);
  const status = useSelector((state) => state.users.status);
  const error = useSelector((state) => state.users.error);
  const skip = useSelector((state) => state.users.skip);
  const limit = useSelector((state) => state.users.limit);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchUsers({ limit, skip }));
    }
  }, [dispatch, status, limit, skip]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight) {
        dispatch(incrementSkip());
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dispatch]);

  useEffect(() => {
    if (status === 'succeeded') {
      dispatch(fetchUsers({ limit, skip }));
    }
  }, [dispatch, skip, limit, status]);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto">
      <table className="min-w-full leading-normal">
        <thead>
          <tr>
            <th>ID</th>
            <th>Image</th>
            <th>Full Name</th>
            <th>Demography</th>
            <th>Designation</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td><img src={user.image} alt={user.fullName} /></td>
              <td>{user.fullName}</td>
              <td>{user.demography}</td>
              <td>{user.designation}</td>
              <td>{user.location}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
