const styles = {
    logo: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: "10px",
      paddingRight: "10px",
      width: '200px',
      height: '50px',
      border: '2px solid #9C27B0',
      borderRadius: '5px',
      fontFamily: 'Arial, sans-serif',
      fontWeight: 'bold',
      fontSize: '14px',
      textTransform: 'uppercase',
      backgroundColor: "#D9AFD9",
backgroundImage: "linear-gradient(0deg, #D9AFD9 0%, #97D9E1 100%)"
    },
    expense: {
      color: '#9C27B0',
      marginRight: '5px',
    },
    tracker: {
      color: '#000000',
    },
  };
  

function Logo() {
  return (
    <div style={styles.logo}>
      <div style={styles.expense}>Expense</div>
      <div style={styles.tracker}>Tracker</div>
    </div>
  );
}

export default Logo;

