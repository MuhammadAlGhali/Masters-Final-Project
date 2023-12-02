import { FlexboxGrid, IconButton } from 'rsuite';
import TrashIcon from '@rsuite/icons/Trash';
import VisibleIcon from '@rsuite/icons/Visible';

export default function IdentityItem(props) {
    return (
        <div className='identity-item'>
            <FlexboxGrid className='item-header'>
                <FlexboxGrid.Item colspan={6}></FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>username</FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}></FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}></FlexboxGrid.Item>
            </FlexboxGrid>
            <FlexboxGrid align='middle'>
                <FlexboxGrid.Item colspan={6}></FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>{props.username}</FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>
                    <IconButton onClick={() => { props.handleView(props.username) }} icon={<VisibleIcon />}>View</IconButton>
                </FlexboxGrid.Item>
                <FlexboxGrid.Item colspan={6}>
                    <IconButton
                        icon={<TrashIcon />}
                        color="red"
                        appearance="primary"
                        onClick={() => { props.handleRemove(props.username,props.iname) }}
                    >
                        Remove
                    </IconButton>
                </FlexboxGrid.Item>
            </FlexboxGrid>
        </div>
    )
}