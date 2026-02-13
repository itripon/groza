import defaultVehicles from '../data/vehicles.json'

function Vehicles({ user }) {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <h3 className="section-title">Vehicles</h3>
        <button className="create-button">+ Add Vehicle</button>
      </div>
      <div className="companies-list">
        <table className="companies-table">
          <thead>
            <tr>
              <th>Plate Number</th>
              <th>Type</th>
              <th>Model</th>
              <th>Status</th>
              <th>Last Inspection</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {defaultVehicles.filter(v => v.companyId === user?.companyId).map(vehicle => (
              <tr key={vehicle.id}>
                <td className="company-name">{vehicle.plateNumber}</td>
                <td>{vehicle.type}</td>
                <td>{vehicle.model}</td>
                <td>
                  <span className={`status-badge ${vehicle.status === 'active' ? 'green' : 'red'}`}>
                    {vehicle.status}
                  </span>
                </td>
                <td>{vehicle.lastInspection}</td>
                <td>
                  <button className="action-btn">Edit</button>
                  <button className="action-btn">Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Vehicles
