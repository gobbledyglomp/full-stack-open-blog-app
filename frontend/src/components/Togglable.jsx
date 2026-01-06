import { useState } from 'react'
import { Button } from 'react-bootstrap'

const Togglable = ({ label, children }) => {
  const [visible, setVisible] = useState(false)

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showWhenVisible = { display: visible ? '' : 'none' }
  const showWhenInvisible = { display: !visible ? '' : 'none' }

  return (
    <div className="mb-4">
      <div style={showWhenVisible}>
        {children}
        <Button onClick={toggleVisibility} variant="dark" className="mt-3">
          Cancel
        </Button>
      </div>
      <div style={showWhenInvisible}>
        <Button onClick={toggleVisibility} variant="dark" className="mt-3">
          {label}
        </Button>
      </div>
    </div>
  )
}

export default Togglable
