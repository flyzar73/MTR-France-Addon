package fr.mtrfranceaddon.block.base;

import fr.mtrfranceaddon.data.BlockProperties;
import org.mtr.mapping.holder.*;
import org.mtr.mapping.tool.HolderBase;
import java.util.List;

public abstract class DirectionalBlock extends MTRFranceAddonBlock {

    public static final DirectionProperty FACING = BlockProperties.FACING;

    public DirectionalBlock(BlockSettings settings) {
        super(settings);
        setDefaultState2(getDefaultState2().with(new Property<>(FACING.data), Direction.NORTH.data));
    }

    // This method is called when a player place a block
    // We get the facing direction of the player and applied it to the block
    @Override
    public BlockState getPlacementState2(ItemPlacementContext ctx) {
        return getDefaultState2().with(new Property<>(FACING.data), ctx.getPlayerFacing().getOpposite().data);
    }
    
    @Override
    public void addBlockProperties(List<HolderBase<?>> properties) {
        super.addBlockProperties(properties);
        properties.add(FACING);
    }
}
