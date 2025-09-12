import chefClaudeLogo from "./images/chef-claude-icon.png"

export default function Header() {
    return (
        <header>
            <img src={chefClaudeLogo}/>
            <h1>ChefGPT</h1>
        </header>
    )
}