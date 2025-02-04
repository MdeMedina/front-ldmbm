import React from 'react';
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Font,
  Image,
} from '@react-pdf/renderer';
const regular = require('./fonts/Roboto-Regular.ttf')
const bold = require('./fonts/Roboto-Bold.ttf')
const italic = require('./fonts/Roboto-Italic.ttf')
const boldItalic = require('./fonts/Roboto-BoldItalic.ttf')
const logoSrc = require('./logo-pdf.png');
Font.register({
  family: 'Roboto',
  fonts: [
    {
      src: regular, 
      format:"truetype",// Fuente regular
      fontWeight: 'normal',
    },
    {
      src: bold,
      format:"truetype", // Fuente en negrita
      fontWeight: 'bold',
    },
    {
      src: italic, 
      format:"truetype",// Fuente cursiva
      fontStyle: 'italic',
    },
    {
      src: boldItalic,
      format:"truetype", // Fuente cursiva en negrita
      fontWeight: 'bold',
      fontStyle: 'italic',
    },
  ],
});
// Definir estilos
const styles = StyleSheet.create({
  page: {
    paddingVertical: 30,
    paddingHorizontal: 45,
    fontSize: 9,
    fontFamily: 'Roboto',
  },
  row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 3,
  },
  rowInsideBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTop:  "0.3px solid rgb(153, 153, 153)",   
    borderBottom: "0.3px solid rgb(153, 153, 153)",
    padding: 3,
},
rowOutsideBox: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  marginBottom: 3,
},
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: "flex-end",
    paddingBottom: 5,
  },
  logo: {
    width: 130,
    height: 49.9435028249,
    marginBottom:5 ,
  },
  headerText: {
    flex: 1,
    marginLeft: 3,
  },
  comer: {
    fontSize: 11,
    fontWeight: "bold",
    color: '#274c7b',
  },
  descComer: {
    fontSize: 9,
    color: "rgb(103, 103, 103)",
    borderBottom: "0.5px solid rgb(103, 103, 103)",
    marginRight: 20,
  },
  contactInfo: {
    fontSize: 9,
    color: "rgb(103, 103, 103)"
  },
  redBox: {
    border: '2px solid #ff0000',
    paddingHorizontal: 30,
    paddingVertical: 7,
    display: "flex",
    justifyContent: "center",
    textAlign: 'center',
    marginLeft: 5,
    fontWeight: 'bold', 
    fontSize: 10,
    color: '#ff0000',
    alignSelf: 'center',
  },
  redBoxText: {
    display: "flex",
    justifyContent: "center",
    textAlign: 'center',
    marginVertical: 0,
    marginHorizontal: "auto",
    fontWeight: 'bold', 
    fontSize: 10,
  },
  clientInfo: {
    border: "1px solid rgb(83, 175, 255)",
    borderRadius: 3,
    padding: 2
  },
  table: {
    display: 'table',
    width: 'auto',
    height: "27%",
    marginTop: 1,
    fontSize: 8,
    border: "1px solid rgb(83, 175, 255)",
    borderRadius: 3,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderBottom: "0.5px solid rgb(153, 153, 153)"
  },
  tableHeaderCell: {
    paddingVertical: 7,
    paddingHorizontal: 4,
    border: '1px solid #fff',
    backgroundColor: 'rgb(25, 113, 255)',
    boxSizing: 'collapse',
  },
  tableHeader: {
    fontWeight: 'bold',
    color: "#fff",
    marginTop: 0.2,
    marginHorizontal: 0.2
  },
  footer: {
    marginTop: 1,
    padding: 5,
    border: "1px solid rgb(83, 175, 255)",
    borderRadius: 3,
  },
  totalSection: {
    paddingTop: 4,
    marginTop: 2,
    width: "25%",
    border: "1px solid rgb(83, 175, 255)",
    borderRadius: 3,
    marginLeft: 2,
  },
  titleSection: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
    marginBottom: 15,
    paddingBottom: 5,
    borderBottom: '1px solid #000',


  },

  observations: {
    marginTop: 2,
    padding: 3,
    width: "90%",
    height: "auto",
    border: "1px solid rgb(83, 175, 255)",
    borderRadius: 3,
  },
  bankDetails: {
    padding: 20,
    fontSize: 8,
  },
});

  const MyDocument = ({cliente, productos, corr, fecha, vendedor, observaciones, total, formaPago, iva, totalIva}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        {/* Logo */}
        <Image src={logoSrc} style={styles.logo} />
        {/* Text */}
        <View style={styles.headerText}>
          <Text style={styles.comer}>COMERCIALIZADORA LOS DEL MAR SPA</Text>
          <Text style={styles.descComer}>VENTA AL POR MENOR POR CORREO, POR INTERNET Y VIA TELEFONICA</Text>
          <Text style={[styles.contactInfo, {marginTop: 5}]}>
            Casa Matriz: MONEDA 1137, Santiago Fono: 56964194749 -
            Email: info@losdelmar.cl
          </Text>

        </View>

        {/* Cuadro rojo */}
        <View style={styles.redBox}>
          <Text style={styles.redBoxText}>RUT: 77.496.323-5</Text>
          <Text style={styles.redBoxText}>COTIZACIÓN</Text>
          <Text style={styles.redBoxText}>APP - Nº {corr}</Text>
        </View>
      </View>

      {/* Aquí continúa el resto del contenido */}
         {/* Client Info */}
         <View style={styles.clientInfo}>
          <View style={styles.row}>
          <Text style={{ width: '25%', fontWeight: 'bold' }}>Señor(es)</Text> <Text style={{ width: '25%' }}>{cliente ? cliente.nombre : false}</Text>
          <Text style={{ width: '25%', fontWeight: 'bold' }}>Fecha</Text>  <Text style={{ width: '25%' }}>{fecha}</Text>
          </View>
          <View style={styles.row}>
          <Text style={{ width: '25%', fontWeight: 'bold' }}>Teléfono</Text><Text style={{ width: '25%' }}>{cliente ? cliente.contacto : false}</Text>
          <Text style={{ width: '25%', fontWeight: 'bold' }}>Email Cliente</Text><Text style={{ width: '25%' }}>{cliente ? cliente.correo : false}</Text>
          </View>
          <View style={styles.row}>
            
        <Text style={{ width: '25%', fontWeight: 'bold' }}>RUT</Text><Text style={{ width: '25%' }}>{cliente ? cliente.RUT : false}</Text>
        {cliente.tipo == "Empresa" ? <><Text style={{ width: '25%' }}>Giro</Text><Text style={{ width: '25%' }}>{cliente ? cliente.giro : false}</Text></> : <><Text style={{ width: '25%' }}></Text><Text style={{ width: '25%' }}></Text></>}
            </View>
            <View style={styles.row}>
        <Text style={{ width: '25%', fontWeight: 'bold' }}>Vendedor</Text><Text style={{ width: '25%' }}>{vendedor.nombre}</Text>
        <Text style={{ width: '25%', fontWeight: 'bold' }}>Email Vendedor</Text><Text style={{ width: '25%' }}>{vendedor.email}</Text>

            </View>

      </View>

      {/* Table */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={[styles.tableHeaderCell, { width: '40%' }]}>Glosa</Text>
          <Text style={[styles.tableHeaderCell, { width: '10%' }]}>Cantidad</Text>
          <Text style={[styles.tableHeaderCell, { width: '20%' }]}>Prc.Unit</Text>
          <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Desc/Rcgr</Text>
          <Text style={[styles.tableHeaderCell, { width: '15%' }]}>Monto</Text>
        </View>

        {
          productos ? productos.map(p => {
            return (
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, { width: '40%' }]}>{p.name}</Text>
          <Text style={[styles.tableCell, { width: '10%' }]}>{p.cantidad} UN</Text>
          <Text style={[styles.tableCell, { width: '20%' }]}>${p.price}</Text>
          <Text style={[styles.tableCell, { width: '15%' }]}>SI</Text>
          <Text style={[styles.tableCell, { width: '15%', textAlign: 'right'}]}>${p.total}</Text>
        </View>
            )
          }) : false
        }
</View>
      <View style={styles.rowOutsideBox}>
      {/* Observaciones */}
      <View style={styles.observations}>
        <Text style={{fontWeight: "bold", marginBottom: 4, fontSize: 10}}>Observaciones</Text>
        <Text style={{fontSize: 8}}>{observaciones}</Text>
      </View>
      {/* Totals */}
      <View style={styles.totalSection}>
        <View style={styles.rowInsideBox}>
        <Text style={{ width: '50%', fontWeight: 'bold' }}>Monto Neto:</Text><Text style={{ width: '50%', textAlign: 'right' }}>${total}</Text>
        </View>
        <View style={styles.rowInsideBox}>
        <Text style={{ width: '50%', fontWeight: 'bold' }}>Monto Exento:</Text><Text style={{ width: '50%', textAlign: 'right' }}>$0</Text>
        </View>
        <View style={styles.rowInsideBox}>
        <Text style={{ width: '50%', fontWeight: 'bold' }}>IVA 19%:</Text><Text style={{ width: '50%', textAlign: 'right' }}>${iva}</Text>
        </View>
        <View style={styles.rowInsideBox}>
        <Text style={{ width: '50%', fontWeight: 'bold' }}>Imp. Esp.:</Text><Text style={{ width: '50%', textAlign: 'right' }}>$0</Text>
        </View>
        <View style={styles.rowInsideBox}>
        <Text style={{ width: '50%', fontWeight: 'bold' }}>Total:</Text><Text style={{ width: '50%', textAlign: 'right' }}>${totalIva}</Text>
        </View>
      </View>
      </View>
    </Page>
  </Document>
);

export default MyDocument;
