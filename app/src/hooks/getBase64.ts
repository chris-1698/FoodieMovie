import QRCode from 'qrcode';

export default function getBase64(pickUpCode: string): Promise<string> {
  var base64Value = QRCode.toDataURL(pickUpCode, { type: 'image/png' });
  // console.log('imagen: ', base64Value);

  return base64Value;
}
