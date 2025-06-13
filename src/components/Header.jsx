import cheflogo from '../images/chef.png';
export default function Header() {
  return (
    <header>
      <img src={cheflogo} alt="chef_icon" />
      <h1>Chef Claude</h1>
    </header>
  );
}
