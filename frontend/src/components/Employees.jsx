import defaultEmployees from '../data/employees.json'

function Employees({ user }) {
  return (
    <section className="dashboard-section">
      <div className="section-header">
        <h3 className="section-title">Employees</h3>
        <button className="create-button">+ Add Employee</button>
      </div>
      <div className="companies-list">
        <table className="companies-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {defaultEmployees.filter(e => e.companyId === user?.companyId).map(employee => (
              <tr key={employee.id}>
                <td className="company-name">{employee.name}</td>
                <td>{employee.email}</td>
                <td>{employee.phone}</td>
                <td>{employee.position}</td>
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

export default Employees
