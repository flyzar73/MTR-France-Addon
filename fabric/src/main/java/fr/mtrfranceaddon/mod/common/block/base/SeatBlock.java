package fr.mtrfranceaddon.mod.common.block.base;

import org.jetbrains.annotations.NotNull;
import org.mtr.mapping.holder.*;
import org.mtr.mod.block.IBlock;

public class SeatBlock extends DirectionalBlock {

    public SeatBlock(BlockSettings settings) {
        super(settings);
    }

    @Override
    public @NotNull VoxelShape getOutlineShape2(BlockState state, BlockView world, BlockPos pos, ShapeContext context) {
        final Direction facing = IBlock.getStatePropertySafe(state, FACING);
        return IBlock.getVoxelShapeByDirection(0, 0, 0, 16, 17, 11, facing);
    }
}
