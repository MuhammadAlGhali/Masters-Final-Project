import { FlexboxGrid, IconButton } from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import VisibleIcon from '@rsuite/icons/Visible';

export default function PasswordItem(props) {
    return (
        <div className='password-item'>
            <FlexboxGrid className='item-header'>
                <FlexboxGrid.Item colspan={6}>website</FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>username</FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}></FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}></FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid align='middle'>
                <FlexboxGrid.Item colspan={6}>
                    <a href={props.url} target='_blank' rel='noreferrer'>{props.url}</a>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>{props.username}</FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>
                    <IconButton onClick={() => { props.handleView(props.username, props.url) }} icon={<VisibleIcon />}>View</IconButton>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>
                    <IconButton
                        icon={<TrashIcon />}
                        color="red"
                        appearance="primary"
                        onClick={() => { props.handleRemove(props.username, props.url) }}
                    >
                        Remove
                    </IconButton>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}