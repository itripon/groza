import defaultActivities from '../data/activities.json'

function RecentActivity() {
  return (
    <section className="dashboard-section">
      <h3 className="section-title">Recent Activity</h3>
      <div className="activity-list">
        {defaultActivities.map(activity => {
          const timeAgo = new Date(activity.timestamp).toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: 'numeric' 
          })
          return (
            <div key={activity.id} className="activity-item">
              <span className="activity-time">{timeAgo}</span>
              <span className="activity-text">{activity.description}</span>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default RecentActivity
