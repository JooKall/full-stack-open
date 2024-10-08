const Notification = ({ notification }) => {
  if (notification.message === null) {
    return null
  }

  const notificationClass = notification.isError ? 'error' : 'success'

  return (
    <div className={notificationClass}>
      {notification.message}
    </div>
  )
}

export default Notification