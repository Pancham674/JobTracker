import "../css/Footer.css"

export default function Footer () {
    return (
        <div className="footer">
            <p>@Pancham674, made with with my sinister mind... | 09/2026 - {`0${new Date().getMonth() + 1}/${new Date().getFullYear()}`}</p>
            <a href="https://www.github.com/Pancham674/jobtracker" target="_blank">Project repository...</a>
        </div>
    );
}