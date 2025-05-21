import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsersCount, fetchOrdersCount, fetchAllActiveSubscription, fetchAllProducts, fetchAllUsers, fetchAllSubscriptions, fetchAllBoxes } from "../store/admin-actions";

export default function Admin() {
    const dispatch = useDispatch();
    const admin = useSelector(state => state.admin)
    
    useEffect(() => {
        dispatch(fetchAllUsersCount());
        dispatch(fetchOrdersCount());
        dispatch(fetchAllActiveSubscription());
        dispatch(fetchAllProducts());
        dispatch(fetchAllUsers());
        dispatch(fetchAllSubscriptions());
        dispatch(fetchAllBoxes());
    }, [])

    return (
        <div className="admin-container">
            <h1 className="admin-title">Admin Dashboard</h1>

            {/* Overview Section */}
            <section className="admin-overview">
                <div className="admin-overview-box">
                <strong>{admin.userCount}</strong>
                <span>Users</span>
                </div>
                <div className="admin-overview-box">
                <strong>{admin.activeSubscriptionCount}</strong>
                <span>Active Subscriptions</span>
                </div>
                <div className="admin-overview-box">
                <strong>{admin.ordersCount}</strong>
                <span>Orders</span>
                </div>
                <div className="admin-overview-box">
                <strong>{admin.allProductsCount}</strong>
                <span>Products</span>
                </div>
            </section>

            {/* User and Subscription Tables */}
            <div className="admin-tables">
                <div className="admin-card">
                <h2>Users</h2>
                <table className='admin-tables-container'>
                    <thead>
                    <tr><th>Name</th><th>Email</th></tr>
                    </thead>
                    <tbody>
                        {Array.isArray(admin.allUsers) && admin.allUsers?.map((user) => (
                            <tr key={user.email}><td style={{width: "65%"}}>{user.name}</td><td><span className="admin-status">{user.email}</span></td></tr>
                        ))}
                    </tbody>

                </table>
                
                </div>

                <div className="admin-card">
                <h2>Subscriptions</h2>
                <table className='admin-tables-container'>
                    <thead>
                    <tr><th>User</th><th>Subscription</th><th>Next Delivery</th></tr>
                    </thead>
                    <tbody>
                        {Array.isArray(admin.allActiveSubscription) && admin.allActiveSubscription?.map((subscription) => (
                            <tr key={subscription._id}><td>{subscription.user}</td><td>{subscription.subscription}</td><td>{new Date(subscription.nextDelivery).toLocaleString("en-US", {  day: "numeric", month: "long" })}</td></tr> 
                        ))}
                    </tbody>
                </table>
                </div>
            </div>

            {/* Orders Section */}
            <div className="admin-card">
                <h2>Orders</h2>
                <table className='admin-tables-container'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Date</th>
                        <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(admin.allBoxes) && admin.allBoxes?.map((box) => (
                        <tr key={box.id}>
                            <td>#{box.id}</td>
                            <td>{box.user}</td>
                            <td>{new Date(box.date).toLocaleString("en-US", {  day: "numeric", month: "long", year: "numeric" })}</td>
                            <td>{box.products}</td>
                        </tr>
                    ))}
                </tbody>
                </table>
            </div>
        </div>
    );
}
